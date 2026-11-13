# Restaurant Survey

WhatsApp survey & engagement platform for restaurants.

**Stack:** Next.js 14 · TypeScript · Tailwind · Supabase · Vercel · Meta WhatsApp Cloud API

## Phase 1 (current)

End-to-end loop: cashier check-in → 30 min → WhatsApp emoji survey → reply → dashboard rating.

WhatsApp runs in **mock mode** until Meta credentials are available. All outbound
messages log to console and `mock_outbox`; view at `/dev/outbox`.

## Local setup

1. **Clone & install**
   ```bash
   git clone <repo-url> restaurant-survey
   cd restaurant-survey
   npm install# restaurant-survey
