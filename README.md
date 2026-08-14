# Flower Web Frontend

Frontend application for **花織 (Hanaori Flowers)**, a Japanese flower e-commerce website built with Next.js.

The application provides a complete customer shopping experience including product browsing, cart and wishlist management, checkout, order tracking, reviews, and notifications. It also includes an administration interface for managing the flower shop.

The frontend communicates with the existing NestJS backend through REST APIs.

---

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Axios
- React Hook Form
- Zod
- Playwright
- ESLint
- Prettier

---

## Main Features

### Customer

Customers can:

- Register and log in
- Manage their profile
- Manage delivery addresses
- Browse flowers by category
- View product details and inventory availability
- Add products to the cart
- Add or remove products from the wishlist
- Apply coupons
- Select delivery dates and time slots
- Place orders
- Use the development mock-payment flow
- View order history and order details
- Track order status
- Cancel eligible orders
- Submit product reviews after delivery
- View and manage submitted reviews
- Edit reviews
- View account notifications

### Product Catalog

The storefront supports:

- Product listing
- Category filtering
- Product detail pages
- Product images
- Inventory information
- Featured products
- Product availability
- Price and sale-price display
- Product review display

Public URLs use product/category slugs where appropriate while backend resources are resolved using their IDs.

### Cart & Wishlist

Authenticated customers can:

- Add products to the cart
- Change quantities
- Remove cart items
- Clear the cart
- Add products to favorites
- Remove products from favorites

Cart information is synchronized with the backend, including:

- Current price
- Quantity
- Stock availability
- Product availability
- Price changes
- Calculated totals

### Checkout

The checkout flow supports:

- Saved delivery addresses
- Delivery-date selection
- Capacity-backed delivery time slots
- Coupon validation
- Order preview
- Transactional order creation

The backend remains authoritative for final:

- Product prices
- Inventory
- Delivery capacity
- Coupon usage
- Delivery fees
- Order totals

### Payment

The current project uses the backend development-only `MOCK` payment method.

This payment flow exists for development and testing purposes and does not represent integration with a real payment gateway.

### Orders

Customers can:

- View order history
- View order details
- Check payment status
- Track order progress
- View purchased products
- Cancel eligible orders
- Write reviews for delivered products

Order ownership is validated by the backend. A customer cannot access another customer's order simply by changing the order ID in the URL.

### Reviews

Customers can submit a review after an order has reached the delivered status.

Reviews support:

- 1–5 star ratings
- Review titles
- Review comments
- Review history
- Review editing
- Review deletion
- Review moderation status

New reviews are submitted with a pending status and can be reviewed by administrators before publication.

### Notifications

The application includes backend-backed notifications for events such as:

- Order creation
- Payment completion
- Order status changes
- Order cancellation
- Review submission
- Review approval
- Review rejection

Notifications support:

- Unread counts
- Read/unread state
- Notification history
- References to related orders or reviews

Customer and administrator notification links are separated so each role is routed to the appropriate protected resource.

### Administration

The admin area provides management functionality for areas such as:

- Dashboard
- Products
- Categories
- Inventory
- Orders
- Delivery settings
- Coupons
- Reviews
- Users
- Notifications

Administrative routes and API operations remain protected by backend authorization.

---

## Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── (store)/
│   ├── account/
│   ├── admin/
│   ├── health/
│   ├── global-error.tsx
│   ├── layout.tsx
│   └── not-found.tsx
│
├── components/
│   ├── layout/
│   └── ui/
│
├── config/
│
├── features/
│   ├── addresses/
│   ├── admin/
│   ├── auth/
│   ├── cart/
│   ├── categories/
│   ├── checkout/
│   ├── notifications/
│   ├── orders/
│   ├── products/
│   ├── reviews/
│   └── wishlist/
│
├── hooks/
├── lib/
│   ├── api/
│   ├── auth/
│   ├── format/
│   └── utils/
│
├── providers/
└── types/
```

The application is organized primarily by business domain under `src/features`.

---

## Backend

This frontend is designed to work with the Flower Web NestJS backend.

During local development:

```text
Frontend
http://localhost:3001

Backend
http://localhost:3000

Backend API
http://localhost:3000/api
```

The frontend uses same-origin `/api` requests and forwards them to the configured backend.

---

## Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure the backend API URL in `.env.local`.

Example:

```env
BACKEND_API_BASE_URL=http://localhost:3000
```

Do not commit `.env.local` or other files containing secrets.

`.env.example` should contain only safe example configuration.

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Update `.env.local` if necessary.

### 3. Start the backend

Start the NestJS backend first.

The default local backend is expected at:

```text
http://localhost:3000
```

### 4. Start the frontend

```bash
npm run dev
```

If port `3000` is already occupied by the backend, Next.js will normally use another available port such as:

```text
http://localhost:3001
```

Open the URL displayed by Next.js in the terminal.

---

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Lint

```bash
npm run lint
```

Runs ESLint.

### Type Check

```bash
npm run typecheck
```

Runs strict TypeScript validation.

### Format

```bash
npm run format
```

Formats supported source and configuration files.

### Format Check

```bash
npm run format:check
```

Checks formatting without modifying files.

### Production Build

```bash
npm run build
```

Creates the production Next.js build.

### Tests

```bash
npm test
```

or:

```bash
npm run test:e2e
```

Runs the Playwright end-to-end test suite against the configured services.

---

## Authentication & Authorization

Authentication is integrated with the NestJS backend.

The frontend stores and uses the returned Bearer token through the project's isolated authentication layer.

Protected routes require a valid authenticated backend profile.

The application supports the following roles:

```text
CUSTOMER
STAFF
ADMIN
```

Customer account pages and administrative pages are separated.

Frontend route protection improves the user experience, but the backend remains the authoritative security boundary for all protected data and operations.

---

## API Integration

The frontend communicates exclusively with the NestJS backend for business data.

Main API domains include:

```text
/api/auth
/api/users
/api/categories
/api/products
/api/cart
/api/wishlist
/api/addresses
/api/delivery
/api/coupons
/api/orders
/api/payments
/api/reviews
/api/notifications
```

Administrative functionality uses the corresponding protected admin APIs.

Axios is used for HTTP communication and TanStack Query manages server state, caching, invalidation, and request lifecycle state.

---

## Error Handling

The frontend provides shared handling for:

- API errors
- Authentication failures
- Unauthorized access
- Missing resources
- Global rendering errors
- Loading states
- Empty states

Invalid or unauthorized backend resources are not reconstructed from URL parameters on the frontend.

---

## Testing

End-to-end tests are implemented with Playwright.

The test suite is intended to validate important user flows against real application services rather than mocked frontend-only behavior.

Test-related files are located under:

```text
e2e/
test/
```

and configuration is defined in:

```text
playwright.config.ts
```

---

## Deployment

Deployment documentation is available at:

```text
docs/deployment.md
```

It covers areas such as:

- Environment configuration
- CI configuration
- Production builds
- Container operation
- Health and readiness checks
- E2E environment isolation
- Staging verification
- Observability
- Rollback considerations

A `Dockerfile` is also provided for containerized deployment.

---

## Security Notes

Important security rules followed by the frontend include:

- Protected data is retrieved only through authenticated backend APIs.
- Backend authorization remains authoritative.
- Customer order access is scoped to the authenticated customer.
- Admin resources use dedicated protected routes.
- Authentication state changes clear private cached data.
- Environment secrets must not be committed.
- Development mock payment must not be treated as a production payment gateway.

---

## Repository

This repository contains the **Next.js frontend** only.

The NestJS backend is maintained separately.

```text
flower-web-fe  → Next.js frontend
flower-web-be  → NestJS backend
```

---

## License

This project is currently intended for development and portfolio use.
