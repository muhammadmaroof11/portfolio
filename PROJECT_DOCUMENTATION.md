# FoodLink Project Documentation

## Architecture Overview

FoodLink is built on a modern Vue 3 stack using Vite and TailwindCSS, integrated tightly with Supabase for backend services (Auth, Database, Realtime, Storage).

### Key Directories

- **`src/views/`**: Contains all page-level components, organized by role (`customer`, `restaurant`, `rider`, `admin`) and public pages.
- **`src/components/`**: Reusable UI components.
- **`src/services/`**: API wrappers interacting with Supabase (`auth.js`, `restaurant.js`, `order.js`, etc.).
- **`src/stores/`**: Pinia stores for global state management (`auth.js`, `cart.js`).
- **`src/utils/`**: Helper utilities (e.g., `placeholders.js`, `imageOptimizer.js`).

## Authentication & Roles

The system uses Supabase Authentication. Each user has a corresponding record in the `profiles` table which defines their role:
- `customer`
- `restaurant`
- `rider`
- `admin`

Routes in `src/router/index.js` are protected by navigation guards that check the user's authentication status and role before granting access to specific portals.

## Database Schema (Supabase)

The core PostgreSQL schema revolves around:
- **`profiles`**: User data and roles.
- **`restaurants`**: Merchant details, linked to an owner profile.
- **`menu_items`**: Dishes belonging to a restaurant.
- **`orders` & `order_items`**: Transactional data linking customers, restaurants, and riders.
- **`transactions`**: Financial ledger for the wallet system.

*For the complete schema, refer to `supabase_schema.sql`.*

## Setting Up Locally

1. Install dependencies: `npm install`
2. Connect to Supabase: Ensure your `.env` contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run the development server: `npm run dev`
4. To build for production: `npm run build`

## Mobile & Desktop Apps (Capacitor)

FoodLink uses a single Vue 3 codebase to generate four distinct Android applications using Capacitor. The build process uses Vite environment variables (`VITE_APP_TARGET`) to compile app-specific bundles.

### Build Pipeline
Run the specific npm script to build the web assets, and then sync them into the Capacitor Android workspace:
- **Diner App**: `npm run build:diner` -> `npx cap sync android --project apps/diner`
- **Rider App**: `npm run build:rider` -> `npx cap sync android --project apps/rider`
- **Merchant App**: `npm run build:merchant` -> `npx cap sync android --project apps/merchant`
- **Admin App**: `npm run build:admin` -> `npx cap sync android --project apps/admin`

Each app lives in the `apps/` directory and contains its own native Android project (`android/`) where splash screens, icons, and package names (e.g., `com.foodlink.rider`) are configured.

### Background Services
The **Rider App** integrates specific native capabilities:
- **Background Geolocation**: Uses `@capacitor-community/background-geolocation` and Android Foreground Services to stream live coordinates to Supabase even when the screen is locked during a mission.
- **Local Notifications**: Uses `@capacitor/local-notifications` paired with Supabase Realtime to alert riders of new dispatch signals immediately while the app or its background service is running.

## Commercial Status

This project is proprietary and built for commercial sale. Unauthorized distribution or use is prohibited.
