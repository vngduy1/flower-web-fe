# Feature modules

Business code is grouped by domain. Each module will receive its own API functions, components, hooks, schemas, types, and utilities only when its implementation phase begins.

Phase 1 created the domain boundaries and shared API foundation. Phase 2 implements the real `auth` and `users` contracts, forms, queries, session provider, and protected layouts. Phase 3 implements the real `categories`, `products`, product image, and product inventory read contracts for the public catalog. Phase 4 implements the authenticated `cart` and `wishlist` contracts, shared commerce actions, protected customer routes, and backend-backed header counts. Phase 5 implements address management, delivery availability, coupon validation, checkout preview, transactional order creation, order success, and the backend's development-only mock payment flow. Remaining domains stay empty until their matching implementation phase.
