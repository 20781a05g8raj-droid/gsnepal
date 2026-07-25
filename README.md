# WS Nepal - B2B Wholesale Marketplace & Admin ERP System

WS Nepal is a full-featured B2B Wholesale Sourcing Marketplace and Enterprise Resource Planning (ERP) Platform built for manufacturers, suppliers, and bulk buyers in Nepal and South Asia.

---

## 🔐 Security & Secret Management

All environment credentials, database URLs, and API keys are strictly managed via environment variables.

### Environment Setup

1. Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Populate `.env` with your actual Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

---

> [!CAUTION]
> ### ⚠️ CRITICAL SECRET ROTATION WARNING
> If any API keys, database credentials, or secret tokens were previously hardcoded in earlier git commits prior to this security pass, **those old values remain visible in the repository's Git commit history**.
> 
> **REQUIRED ACTION**:
> 1. Go to your **Supabase Dashboard** -> **Project Settings** -> **API**.
> 2. Click **Reset API Key** / **Rotate Secret** to revoke any previously hardcoded keys immediately.
> 3. Update your `.env` file and Vercel Deployment environment variables with the newly generated keys.

---

## 🛠️ Features & Architecture

- **Public Master Catalog**: Wholesale product discovery with search, category filtering, and direct WhatsApp lead generation.
- **Seller ERP Dashboard**: Product management, inventory controls, and sales transaction ledger.
- **Admin ERP Control Center**: Confidential seller/buyer ratings, private admin evaluation notes, catalog approvals, and trade analytics.
- **Supabase Real-Time Database**: Row-Level Security (RLS) protected PostgreSQL tables (`sellers`, `buyers`, `products`, `sales_journal`, `inquiries`, `company_product_sales`).

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```

### Database Migration

Execute `supabase_schema.sql` inside the **Supabase Dashboard -> SQL Editor** to initialize all tables, Row Level Security (RLS) policies, and analytical views.
