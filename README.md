# Gala Fund - GCash Trip Tracker for Hong Kong

Gala Fund is an offline-first Expo React Native expense tracker for Filipino travelers using PHP in Hong Kong. It logs trips and expenses locally, supports QR-assisted merchant capture, receipt OCR parsing, Android shared-image intake, and built-in HKD/PHP conversion.

The active app implementation is entirely under `frontend/`. The `backend/` folder contains helper API code but is not wired into the running Expo app.

---

## What this app actually does

- Local SQLite expense and trip tracking using `expo-sqlite`
- Dashboard with total spent, budget progress, remaining balance, and recent transactions
- Category spend overview for Food, Transport, Shopping, and Activities
- QR scanner for GCash/EMV payment codes to prefill merchant details
- Receipt image parsing and text recognition using `@react-native-ml-kit/text-recognition`
- Android share intent receiver for receipt images via `expo-share-intent`
- PHP/HKD currency converter with live rate fetch and manual override
- Transaction list with search, category filter, and delete actions
- Budget preference screen with duration and currency preference
- Android home widget support via `react-native-android-widget`

---

## What this app does not do

- It does not connect to the GCash API or read wallet transaction history
- It does not sync data to a cloud backend; all data is stored on-device
- It does not currently implement CSV import/export or PDF export in the running codebase

---

## Architecture

### Frontend app (`frontend/`)

The app uses Expo Router and contains:

- `app/` screens: onboarding, dashboard, scan, transactions, budget, converter, share
- `components/` reusable UI pieces and widgets
- `db/` SQLite persistence, query helpers, and dashboard/converter hooks
- `scanner/` QR scan and receipt OCR parser logic
- `share/` Android shared-image receipt receiver
- `widget/` Android widget UI and update handler
- `api/` local weather and currency fetch helpers
- `lib/` theme, category color, and helper utilities

### Data persistence

The app stores trip and expense data in local SQLite tables.

#### `trips`
- `id`, `name`, `budget_hkd`, `exchange_rate`, `created_at`
- migrated fields: `duration_days`, `currency_preference`

#### `expenses`
- `id`, `trip_id`, `php_amount`, `category`, `note`, `date`, `source`, `image_uri`, `created_at`

---

## Setup and run

### Prerequisites

- Node.js 18+ recommended
- npm or yarn
- Android Studio or a physical Android device

### Install and start

```bash
cd frontend
npm install
npx expo start
```

### Run on Android

```bash
cd frontend
npx expo run:android
```

Because the app uses native modules for camera scanning, ML Kit text recognition, share intent handling, and Android widgets, a native build or development client is required for full functionality.
