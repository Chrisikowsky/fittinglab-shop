---
description: How to implement Medusa v2 features - always research docs first
---

# Medusa v2 Development Workflow

## IMPORTANT: Always Research First!

Before writing ANY code that touches Medusa v2 APIs, endpoints, or data models:

1. **Search the Medusa v2 docs** at `https://docs.medusajs.com` for the relevant topic
2. **Check the API reference** at `https://docs.medusajs.com/api/store` (Store API) or `https://docs.medusajs.com/api/admin` (Admin API)
3. **Read the storefront guides** at `https://docs.medusajs.com/resources/storefront-development/`
4. **Verify endpoint structure** — don't assume relations exist on endpoints (e.g. orders are NOT on `/store/customers/me`, they have their own `/store/orders` endpoint)

## Key Lessons Learned

- **Session cookies**: Medusa in production mode already sets `SameSite=None`, `Secure=true`, `trust proxy=1`. Do NOT add custom `cookieOptions` unless absolutely necessary.
- **Customer orders**: Use `GET /store/orders` (separate endpoint), NOT `?fields=+orders` on `/store/customers/me`
- **Customer addresses**: Use `?fields=+addresses` on `/store/customers/me` — this DOES work as a relation
- **Registration flow**: `POST /auth/customer/emailpass/register` → `POST /store/customers` (with Bearer token + email) → `POST /auth/session`
- **Login flow**: `POST /auth/customer/emailpass` → `POST /auth/session` → `GET /store/customers/me`
- **CORS**: Both `STORE_CORS` and `AUTH_CORS` must include all frontend origins (with `https://` and both `www` and non-www)

## Tech Stack

- **Backend**: Medusa v2 on Railway (auto-deploys from GitHub)
- **Frontend**: Next.js on Vercel (auto-deploys from GitHub)
- **API Domain**: `api.fittinglab.pro`
- **Frontend Domain**: `www.fittinglab.pro` / `fittinglab.pro`
- **Auth**: Cookie-based sessions (secure, HttpOnly)
