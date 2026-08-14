# Production E2E suite

The suite runs against the real Next.js frontend and NestJS backend. It does not mock
business APIs.

Required runtime variables:

- `E2E_ADMIN_EMAIL`
- `E2E_ADMIN_PASSWORD`

Optional origin overrides:

- `E2E_BASE_URL` (defaults to `http://localhost:3001`)
- `E2E_API_BASE_URL` (defaults to `http://localhost:3000/api`)

The ADMIN account is treated as a bootstrap account. The suite creates unique STAFF and
CUSTOMER users and soft-deletes them during worker teardown. Category mutation tests also
use unique slugs and clean up through the backend's soft-delete endpoint.

CI uses a fresh `flower_e2e` MySQL service and the backend's guarded `npm run seed:e2e`
command. The reset command refuses non-test environments and database names without a
`test` or `e2e` marker. See `docs/deployment.md` for the required CI secrets and complete
service orchestration.
