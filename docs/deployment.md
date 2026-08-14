# Deployment and operations

## Service topology

The Next.js frontend and NestJS API are separate processes. In development the backend
listens on `http://localhost:3000` and Next.js normally listens on
`http://localhost:3001`. Browser traffic stays same-origin: Next.js rewrites `/api` and
`/uploads` to the backend. A production reverse proxy should terminate TLS, forward the
public origin to Next.js, preserve streaming responses, and keep the backend private.

The repositories are separate Git worktrees. The frontend CI workflow checks out the
verified backend repository into a sibling directory for real-service E2E testing.

## Environment variables

### Frontend

| Variable                   | Scope               | Required    | Purpose                                                           |
| -------------------------- | ------------------- | ----------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Browser, build-time | Yes         | Same-origin Axios base path; normally `/api`.                     |
| `BACKEND_API_BASE_URL`     | Server/build        | Yes         | Absolute NestJS API base URL, including `/api`.                   |
| `NEXT_DEPLOYMENT_ID`       | Build-time          | Recommended | Unique release identifier for rolling-deployment skew protection. |
| `HEALTHCHECK_TIMEOUT_MS`   | Server runtime      | No          | Backend readiness timeout; defaults to 3000 ms.                   |
| `PORT` / `HOSTNAME`        | Server runtime      | No          | Next.js listen address; container defaults to `3000` / `0.0.0.0`. |

Variables prefixed with `NEXT_PUBLIC_` are embedded in browser bundles. Never place a
secret in one. The standalone build serializes Next.js rewrite configuration, so
`BACKEND_API_BASE_URL` must represent the target environment at build time and must also
be supplied at runtime for `/health/ready`.

### Backend

The authoritative list is in the backend `.env.example`. Staging and production require
separate database credentials, a unique JWT secret of at least 32 characters,
`DB_SYNCHRONIZE=false`, `DB_DROP_SCHEMA=false`, and an exact comma-separated
`CORS_ORIGINS` allowlist when direct cross-origin API calls are intentionally supported.
The current frontend proxy does not require browser CORS.

### E2E and CI secrets

Configure these as GitHub repository secrets, never repository variables or source files:

- `CI_DB_ROOT_PASSWORD`
- `CI_JWT_SECRET`
- `E2E_ADMIN_EMAIL`
- `E2E_ADMIN_PASSWORD`

Optional repository variables `BACKEND_REPOSITORY` and `BACKEND_REF` select the backend
source. They default to the verified backend remote and `main`. GitHub does not expose
secrets to untrusted fork pull requests, so real-service E2E is explicitly skipped there;
the frontend quality job still runs.

## Local development

1. Start MySQL using the root Compose file and a local, untracked root `.env`.
2. Configure the backend from its `.env.example`. Local development may explicitly use
   `DB_SYNCHRONIZE=true`; staging and production may not.
3. Run `npm run start:dev` in the backend.
4. Configure the frontend from `.env.example` and run `npm run dev`.
5. Run Playwright with ADMIN credentials loaded from an ignored `.env.e2e.local`.

## Production build and startup

Backend:

```text
npm ci
npm run typecheck
npm test -- --runInBand
npm run build
npm run start:prod
```

Frontend:

```text
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run start -- --hostname 0.0.0.0 --port 3001
```

Verify `GET /api/health/ready` on the backend and `GET /health/ready` on the frontend
before admitting traffic.

## Containers

Both repositories contain multi-stage, non-root Dockerfiles. Example builds:

```text
docker build -t flower-backend ./backend
docker build --build-arg BACKEND_API_BASE_URL=http://backend:3000/api -t flower-frontend ./frontend
```

Pass secrets only at runtime through the orchestrator. Do not bake `.env` files into
images. The backend `/app/uploads` directory requires a persistent volume or replacement
with managed object storage. Container health checks are liveness-only; configure the
orchestrator readiness probe against each `/ready` endpoint.

## Isolated E2E database

CI creates a fresh MySQL service named `flower_e2e`. The guarded backend `seed:e2e`
command requires `NODE_ENV=test`, `DEPLOYMENT_ENV=test`, `E2E_ALLOW_RESET=true`,
`DB_DROP_SCHEMA=true`, `DB_SYNCHRONIZE=true`, and a database name containing `test` or
`e2e`. It recreates the schema from the verified entities, seeds ADMIN/STAFF/CUSTOMER
roles, and creates the ADMIN bootstrap account from secrets. The Playwright worker creates
unique STAFF and CUSTOMER accounts through the actual admin API and soft-deletes them;
the next disposable database removes all accumulated data.

Never run the reset command against a shared developer, staging, or production database.

## CI behavior

Every push and pull request runs frontend install, format check, lint, strict typecheck,
production build, whitespace validation, and generated-diff validation. When required
secrets are available, CI also installs and builds the backend, runs backend unit tests,
resets/seeds isolated MySQL, starts both production servers, waits for database-aware
readiness, runs the complete Playwright suite, uploads traces/screenshots/video/logs on
failure, and terminates both processes.

The backend-wide ESLint baseline still contains pre-existing strict-rule failures in
business modules. CI therefore applies zero-warning linting to the Phase 9 operational
surface while full backend typecheck, build, unit tests, and Playwright remain mandatory.

## Staging checklist

- Use a dedicated database and credentials, JWT secret, hostname, upload volume, and
  deployment ID; never reuse production secrets.
- Build the frontend with the staging backend target and deploy the matching frontend and
  backend revisions together.
- Keep schema synchronization and destructive reset disabled.
- Run migrations before application rollout once a reviewed migration baseline exists.
- Probe backend and frontend readiness before shifting traffic.
- Confirm request IDs appear in proxy and backend logs and configure log retention.
- Run the real-service E2E workflow against the isolated CI environment, not production.

## Health and observability

The backend emits structured startup, shutdown, readiness-failure, and per-request events.
Each request receives an `X-Request-Id`; accepted inbound IDs are length/character limited.
Logs exclude request bodies, Authorization headers, JWTs, passwords, and user fields.

The frontend exposes liveness and backend-dependent readiness. Existing App Router error
boundaries provide user-visible failures, but no external monitoring provider is
configured. A future provider should be connected through Next.js instrumentation and the
Nest logger without changing business contracts. Monitor readiness, 5xx rate, latency,
container restarts, database saturation, and disk usage for uploads.

## Security and recovery

The frontend sends clickjacking, MIME-sniffing, referrer, and permissions headers. HSTS
must be set at the HTTPS terminator after TLS is verified. A strict nonce-based CSP is not
included because a static policy would break Next.js inline bootstrap scripts; implement
and test it with the deployment proxy or Next.js nonce guidance.

Bearer JWTs remain in `localStorage` because the backend has no refresh-token or secure
cookie contract. This makes XSS prevention especially important and remains an
architecture risk for full production.

Before rollback, preserve database and upload backups. Roll application images back to a
known matching frontend/backend pair. Database rollback is restore-based because the
backend still lacks a checked-in migration baseline and rollback command. Do not claim a
schema rollback until forward and reverse migrations are reviewed and exercised on a
staging copy.
