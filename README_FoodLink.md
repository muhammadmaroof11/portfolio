# FoodLink: Gourmet Logistics Platform

FoodLink is a premium, high-fidelity web application designed for gourmet food delivery and merchant management. It connects discerning customers with elite culinary artisans through a seamless, dynamic interface.

**Notice: This is a proprietary project intended for commercial sale. It is NOT open-source software.**

## Overview

FoodLink operates as a multi-portal ecosystem, providing dedicated experiences for:
- **Customers**: A sleek discovery hub to find and order gourmet meals.
- **Restaurants (Merchants)**: A comprehensive dashboard to manage menus, track live orders, and view financial analytics.
- **Riders**: An interface for accepting and tracking delivery missions.
- **Admins**: A central command center for user and merchant management.

## Tech Stack

- **Frontend**: Vue.js 3 (Composition API), Vite, TailwindCSS (Customized Design System)
- **Backend & Database**: Supabase (PostgreSQL, Realtime, Storage, Authentication)
- **Mobile Packaging**: Capacitor (Android/iOS)
- **Routing**: Vue Router
- **State Management**: Pinia
- **Maps & Native**: Leaflet.js, Capacitor Background Geolocation, Local Notifications

## Multi-App Architecture & Native Capabilities

FoodLink uses a single Vue 3 codebase to dynamically generate four distinct Android applications (`Diner`, `Rider`, `Merchant`, `Admin`) using Capacitor.

- **Dynamic Theming**: Authentication screens automatically re-brand and style themselves based on the targeted app (e.g., Emerald for Riders, Amber for Merchants).
- **Background Tracking (Rider App)**: Uses native Android Foreground Services (`@capacitor-community/background-geolocation`) to continuously broadcast rider coordinates to Supabase during active missions, even when the phone screen is off.
- **Instant Notifications**: Leverages Supabase Realtime combined with `@capacitor/local-notifications` to instantly alert riders of new dispatch signals natively.

## Build Pipeline

To build a specific application, use the respective Vite target command and sync with Capacitor:
```bash
npm run build:rider
npx cap sync android --project apps/rider
```
*(Available scripts: `build:rider`, `build:merchant`, `build:diner`, `build:admin`)*

## Project Documentation

Detailed documentation on the architecture, setup, and assets can be found in the `docs/` directory:

- [Project Documentation](docs/PROJECT_DOCUMENTATION.md): Detailed technical overview, routing, and setup guide.
- [Asset Guide](docs/ASSET_GUIDE.md): Guidelines on managing images, placeholders, and the Supabase Storage District.
- [Frontend Architecture](FRONTEND_ARCHITECTURE.md): Design system and aesthetic manifest.

## License

**Copyright (c) 2024. All Rights Reserved.**
This software and associated documentation files (the "Software") are proprietary and confidential. You may not use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software without explicit written permission from the owner.
