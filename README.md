# Flower Web Frontend

Production-hardened Japanese flower e-commerce frontend built with the Next.js App Router,
strict TypeScript, Tailwind CSS, Axios, TanStack Query, React Hook Form, and Zod. It uses
the existing NestJS backend as the only business API.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` if the local file does not exist. `BACKEND_API_BASE_URL` points to the NestJS API, while the public Axios base path remains same-origin at `/api`.
3. Start the NestJS backend at `http://localhost:3000/api`.
4. Start this frontend with `npm run dev`.
5. Open the local URL printed by Next.js. If port 3000 is occupied by the backend, Next.js will select another port automatically.

## Quality scripts

- `npm run lint` — ESLint with zero warnings allowed
- `npm run typecheck` — strict TypeScript validation
- `npm run format` — format source and configuration files
- `npm run format:check` — check formatting without writing
- `npm run build` — production build

- `npm test` / `npm run test:e2e` - real-service Playwright suite

## Deployment

See [`docs/deployment.md`](docs/deployment.md) for environment ownership, CI secrets,
isolated E2E setup, production startup, container operation, health/readiness probes,
staging checks, observability, and rollback limitations.

## Architecture

- `src/app` — App Router pages, route-group layouts, and global fallbacks
- `src/components` — shared UI and layout components
- `src/config` — validated public environment configuration
- `src/features` — business-domain modules, implemented phase by phase
- `src/lib/api` — reusable Axios client and error normalization
- `src/lib/auth` — isolated token persistence used by the API layer
- `src/providers` — app-wide client providers
- `src/types` — shared TypeScript contracts

## Phase 2 authentication

The frontend integrates the backend contracts directly:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/users/me`
- `PATCH /api/users/me`

Registration creates a customer and then returns to login because the backend registration response does not contain a token. Login stores the returned Bearer token in the isolated token layer, restores the current user through `/auth/profile`, and clears the local session on logout or an invalid `401` response.

Account routes require an authenticated backend profile. The admin layout accepts `ADMIN` and `STAFF`, matching the existing backend dashboard guard; `CUSTOMER` is redirected to the account area. Backend guards remain authoritative for every protected API request.

## Phase 3 product catalog

The public catalog integrates these backend contracts:

- `GET /api/categories`
- `GET /api/categories/:id`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/:productId/images`
- `GET /api/products/:productId/inventory`

The backend detail routes accept IDs, so public product and category slugs are resolved against the real list responses before the matching ID endpoint is requested. Public product sorting is currently fixed by the backend to newest-first; the frontend does not invent unsupported sort modes. Product images returned under `/uploads` are served through the same-origin Next.js rewrite.

Home, product list, category, and product detail routes use backend pagination and hydrated TanStack Query caches.

## Phase 4 cart and wishlist

Authenticated cart and wishlist experiences integrate these backend contracts:

- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`
- `DELETE /api/cart`
- `GET /api/wishlist`
- `POST /api/wishlist/:productId`
- `DELETE /api/wishlist/:productId`

Product cards and detail pages use shared backend-backed actions. The header reuses the cart and wishlist queries for counts, and logout removes all protected query data. Cart totals, availability, stock limits, and price-change flags are rendered from the backend response.

## Phase 5 checkout and mock payment

The authenticated checkout experience integrates the backend address, delivery, coupon, checkout-preview, order, and payment contracts. Customers can manage saved addresses, select only delivery dates and capacity-backed time slots returned by the backend, validate a coupon against the current cart, create an order transactionally, and inspect the returned order snapshot.

The payment panel uses the backend's development-only `MOCK` payment method. Confirm and fail actions are clearly labeled as test actions and do not represent a real payment gateway. Checkout totals assembled before submission are labeled provisional; the order response is the authoritative final amount because order creation revalidates delivery capacity, stock, prices, coupon usage, and delivery fees inside a transaction.

Logout now removes address, checkout, delivery, coupon, order, payment, cart, wishlist, user, and authentication query data.
