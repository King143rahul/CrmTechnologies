# CRM Technology — E-Commerce Platform

> Headless e-commerce system for an ICT/CCTV distributor, built on **Medusa.js v2** and **Next.js**.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Docker Compose                     │
├──────────┬──────────┬──────────┬──────────┬─────────┤
│ Frontend │ Backend  │ Postgres │  Redis   │ Meili   │
│ Next.js  │ Medusa   │ 15-alp   │ 7-alp    │ v1.6    │
│ :8000    │ :9000    │ :5432    │ :6379    │ :7700   │
└──────────┴──────────┴──────────┴──────────┴─────────┘
```

| Component | Tech | Purpose |
|-----------|------|---------|
| **Backend** | Medusa.js v2.13 | Headless commerce API, admin panel |
| **Frontend** | Next.js 15 + Tailwind CSS | Dark-mode storefront |
| **Database** | PostgreSQL 15 | Product, order, customer data |
| **Cache** | Redis 7 | Event bus, session cache |
| **Search** | Meilisearch v1.6 | Search-as-you-go product search |
| **Payments** | Paystack | SA payment gateway (ZAR) |
| **Shipping** | The Courier Guy / Bob Go | Real-time ZAR shipping rates |

---

## 📋 Prerequisites

- **Node.js** v20+ (v24 recommended)
- **Docker & Docker Compose** (for full-stack setup)
- **PostgreSQL** (if running without Docker)
- **Redis** (if running without Docker)

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone and start the entire stack
docker compose up --build

# Access:
# - Storefront:   http://localhost:8000
# - Backend API:  http://localhost:9000
# - Admin Panel:  http://localhost:9000/app
# - Meilisearch:  http://localhost:7700
```

### Option 2: Local Development

```bash
# 1. Start PostgreSQL and Redis (via Docker or locally)
docker compose up postgres redis meilisearch -d

# 2. Start the backend
cd crm-backend
cp .env.template .env   # Edit DATABASE_URL if needed
npm run dev

# 3. Start the frontend (in a new terminal)
cd crm-frontend
cp .env.local.example .env.local
npm run dev
```

---

## 🏪 Seed Dealer/Distributor Pricing

This creates the **"Distributor"** customer group and **wholesale price list**:

```bash
cd crm-backend

# Run the seed script
npx medusa exec src/scripts/seed-dealer-pricing.ts
```

**What it does:**
1. Creates a **"Distributor"** customer group (for verified wholesale buyers)
2. Creates a **"Retail"** customer group (for standard customers)
3. Creates a **"Wholesale Distributor Pricing"** price list linked to the Distributor group

**Next steps after seeding:**
- Add products via Medusa Admin → Products
- Go to **Pricing → Wholesale Distributor Pricing** and add wholesale prices
- Assign distributor customers to the **Distributor** group

---

## 📦 Bulk Product Import (Shopify CSV)

Import products from a Shopify export CSV:

```bash
cd crm-backend
npx medusa exec src/scripts/import-shopify-csv.ts -- --file=path/to/products.csv
```

Mapped columns: Handle, Title, Body (HTML), Vendor, Type, Tags, Variant SKU/Price/Weight, Image Src, Option1-3.

---

## ⚙️ Environment Variables

### Backend (`crm-backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgres://...` | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection |
| `VAT_RATE` | `15` | SA VAT rate (set to `16` when new rate applies) |
| `PAYSTACK_SECRET_KEY` | — | Paystack secret key |
| `PAYSTACK_PUBLIC_KEY` | — | Paystack public key |
| `MEILISEARCH_HOST` | `http://localhost:7700` | Meilisearch URL |
| `MEILISEARCH_API_KEY` | `masterKey` | Meilisearch master key |
| `SHIPPING_API_KEY` | — | The Courier Guy / Bob Go API key |
| `SHIPPING_PROVIDER` | `thecourierguy` | Shipping provider (`thecourierguy` or `bobgo`) |

### Frontend (`crm-frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | `http://localhost:9000` | Backend API URL |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | — | Publishable API key from Medusa |

---

## 🛣️ Custom API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/store/dealer-application` | Submit dealer application + document upload |
| `GET` | `/store/dealer-application?email=...` | Check application status |
| `GET` | `/store/vat-info` | Get current VAT rate and config |
| `POST` | `/store/shipping-rates` | Get real-time shipping rate quotes |

---

## 📁 Project Structure

```
CrmTechnologies/
├── docker-compose.yml          # Full-stack orchestration
├── README.md
├── crm-backend/                # Medusa.js v2 backend
│   ├── medusa-config.ts        # Medusa configuration
│   ├── Dockerfile
│   └── src/
│       ├── api/store/          # Custom API routes
│       │   ├── dealer-application/
│       │   ├── shipping-rates/
│       │   └── vat-info/
│       ├── jobs/               # Scheduled jobs
│       │   └── abandoned-cart.ts
│       ├── modules/            # Custom modules
│       │   └── dealer-application/
│       ├── scripts/            # Seed & import scripts
│       │   ├── seed.ts
│       │   ├── seed-dealer-pricing.ts
│       │   └── import-shopify-csv.ts
│       └── utils/
│           └── vat.ts          # SA VAT helper
└── crm-frontend/               # Next.js storefront
    ├── Dockerfile
    ├── tailwind.config.js      # Dark theme config
    └── src/
        ├── app/                # Next.js pages
        │   └── [countryCode]/
        │       └── (main)/
        │           └── dealer-application/
        ├── styles/
        │   └── globals.css     # CRM dark theme
        └── modules/            # UI components
```

---

## 🇿🇦 South African Localization

- **VAT**: Configurable via `VAT_RATE` env variable (15% default, toggle to 16%)
- **Currency**: ZAR (South African Rand)
- **Payments**: Paystack integration (supports ZAR, multi-currency)
- **Shipping**: The Courier Guy / Bob Go real-time rates
- **Locale**: `en_ZA` configured in storefront metadata

---

## 📝 License

MIT