# AditiStore Frontend

AditiStore is a modern e-commerce frontend built with Next.js App Router. It includes a public shopping experience and an ADMIN dashboard for catalog and order operations.

## Overview

This project is the frontend client for the AditiStore backend API. It provides:

- Public storefront (`/`, `/shop`, `/shop/[id]`, `/cart`, `/order`, `/checkout`)
- User authentication (`/login`, `/register`) with cookie-based session
- User account features (`/account`, `/wishlist`, order history)
- ADMIN dashboard (`/dashboard`) with product/category/order/user management

## Tech Stack

- Next.js `16.1.1` (App Router)
- React `19`
- TypeScript
- Tailwind CSS `v4`
- Radix UI primitives + custom UI components
- Framer Motion
- Sonner (toast notifications)
- Recharts (dashboard analytics)

## Key Features

### Shop Experience

- Product listing with search, sort, and filters (category, size, color, price)
- Product detail view with variants and image galleries
- Featured products, best sellers, and coming soon sections
- Wishlist and cart persisted in localStorage

### Checkout and Orders

- Checkout flow with backend order creation
- KHQR payment flow with QR generation + polling verification
- Order history and order detail retrieval

### Authentication and Access Control

- Login/register flows through backend API
- Session uses HTTP-only cookie (`credentials: include`)
- Auto refresh on expired access (handled in API client)
- Role-based route access: ADMIN users can access `/dashboard`

### Admin Dashboard

- Product table with pagination, search, and advanced filters
- Product create/edit/delete with variant management and image uploads
- Product detail modal with image carousel and variant table
- Category CRUD
- Order management and status updates
- User listing and detail fetch
- Product analytics summary

## Project Structure

```text
src/
  app/
    (shop)/
      page.tsx
      shop/page.tsx
      shop/[id]/page.tsx
      cart/page.tsx
      order/page.tsx
      checkout/page.tsx
      account/page.tsx
      wishlist/page.tsx
      blog/page.tsx
    (auth)/
      login/page.tsx
      register/page.tsx
    (dashboard)/
      layout.tsx
      dashboard/page.tsx
      dashboard/products/page.tsx
      dashboard/categories/page.tsx
      dashboard/orders/page.tsx
      dashboard/users/page.tsx
      dashboard/settings/*
  components/
    dashboard/
    shop/
    layout/
    ui/
  context/
    AuthContext.tsx
    CartContext.tsx
    WishlistContext.tsx
  lib/api/
    client.ts
    auth.ts
    product.ts
    category.ts
    orders.ts
    checkout.ts
    user.ts
  types/
```

## API Integration

All API calls use `src/lib/api/client.ts`.

- Base URL comes from `NEXT_PUBLIC_API_BASE_URL`
- Requests include cookies (`credentials: include`)
- If request returns `401`, client attempts `POST /api/auth/refresh`
- If refresh fails, user is redirected to `/login?expired=true`

## Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Production example (already used in this repo `.env`):

```bash
NEXT_PUBLIC_API_BASE_URL=https://additi-backend.onrender.com
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Running AditiStore backend API

### Install and Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev         # start dev server (webpack)
npm run dev:turbo   # start dev server (turbopack)
npm run build       # production build
npm run start       # run built app
npm run lint        # eslint
```

## Important Routes

### Public

- `/` home
- `/shop` product listing
- `/shop/[id]` product detail
- `/cart` cart page
- `/order` checkout + payment flow
- `/checkout` alternative checkout flow
- `/blog`, `/about`, `/contact`, `/feature`

### Auth

- `/login`
- `/register`

### Protected

- `/account`
- `/wishlist`

### Admin

- `/dashboard`
- `/dashboard/products`
- `/dashboard/categories`
- `/dashboard/orders`
- `/dashboard/users`
- `/dashboard/settings/*`

`/dashboard` requires `ADMIN` role. Non-admin users are redirected to `/unauthorized`.

## Image and Icon Notes

- App icons are configured in `src/app/layout.tsx` (`/icon.svg`, `/icon.png`, `/apple-icon.png`)
- Public asset names are case-sensitive in deployment (Linux). Example: `/Aditilogo.png` must match actual filename exactly
- Next/Image remote domains are configured in `next.config.ts`

## Deployment

This app is deployed on Vercel.

Before deploying:

1. Set `NEXT_PUBLIC_API_BASE_URL` in Vercel Environment Variables
2. Ensure backend CORS and cookie settings allow your frontend domain
3. Verify public assets and icon files exist with exact casing

## Troubleshooting

### Logo/Icon not showing in production

- Check path casing (`/Aditilogo.png` vs `/aditilogo.png`)
- Hard refresh browser cache
- Confirm metadata icon paths in `src/app/layout.tsx`

### Unauthorized dashboard access

- Confirm logged-in user has `ADMIN` role from `/api/auth/me`

### API requests failing

- Confirm `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check backend availability and CORS settings

## License

Internal project for AditiStore team.
