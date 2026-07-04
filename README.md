# Gala Fund - GCash Trip Tracker for Hong Kong

Gala Fund is an offline-first trip expense tracker designed for Filipino tourists spending Philippine Pesos (PHP) via GCash while traveling in Hong Kong. It allows users to manage their travel budget, categorize expenses, and track transactions in both PHP and Hong Kong Dollars (HKD) without requiring account creation, cloud database synchronization, or direct access to GCash production systems.

The system comprises a React Native frontend app (Expo) and a minimal caching integration layer (backend) for weather forecasts and daily exchange rates.

---

## Architecture and Design

The application utilizes a fully local client-side architecture to ensure complete privacy, speed, and capability to function in subterranean transit networks (such as the MTR) or areas with weak mobile connectivity.

### System Topography

```
                     +---------------------------------------+
                     |             Gala Fund App             |
                     |         (React Native / Expo)         |
                     +---+-------------------------------+---+
                         |                               |
                         v                               v
            +------------+------------+     +------------+------------+
            |      SQLite Database    |     |       Expo Camera       |
            |      (expo-sqlite)      |     |  (QR Code / OCR Shutter)|
            +-------------------------+     +------------+------------+
                                                         |
                                                         v
                                            +------------+------------+
                                            |   Google ML Kit OCR     |
                                            |   (Text Recognition)    |
                                            +-------------------------+
```

### Core Features

1. **Dashboard Overview**: Displays total budget usage via a visual progress ring, remaining balance, category spend distribution (Food, Transport, Shopping, Activities, Entertainment), and a quick list of recent transactions. Include a live weather status for Hong Kong fetched via the backend proxy.
2. **QR-Assisted Quick-Add**: Captures EMV QR and GCash payment QR code payloads using the device camera. The app parses the EMVCo standard payload locally to resolve the merchant name and ID, automating the data-entry step so travelers do not need to type merchant names manually.
3. **Receipt OCR Scanning**: Users can snap a picture of physical receipts. The app processes the image through Google ML Kit's Text Recognition library and runs custom regex parsers to extract amounts and merchant names.
4. **Manual & Import Modes**: Supports traditional manual transaction entry and bulk imports via GCash Passbook CSV/JSON exports.
5. **Multi-Format Export**: Generates local Excel (.xlsx) files detailing individual rows and category summaries, or clean PDF liquidation summaries optimized for print and travel reimbursement submission.
6. **Currency Utility**: Built-in converter tab supporting offline calculations with user-editable base exchange rates.

---

## Technical Stack

### Frontend (App)

* **Framework**: React Native with Expo (v57 SDK)
* **Routing & Navigation**: Expo Router (file-based routing with TypeScript/TSX views)
* **Database Engine**: Native SQLite via `expo-sqlite` (WAL journal mode enabled)
* **Camera Handling**: `expo-camera` (using built-in barcode scanner modules)
* **Optical Character Recognition**: `@react-native-ml-kit/text-recognition` (native binding to Google Mobile Vision ML Kit)
* **UI Components**: Native React Native StyleSheet API and `lucide-react-native` vector icons
* **Animations**: `react-native-reanimated`

### Backend (Caching and API Integration Layer)

* **Runtime**: Node.js
* **Caching Strategy**: Stale-while-revalidate local AsyncStorage caching
* **Upstream APIs**:
  * Currency: Frankfurter API (European Central Bank reference rates; cached for 6 hours)
  * Weather: Hong Kong Observatory Open Data API (cached for 30 minutes)

---

## Database Schema

Local data persistence is built on `expo-sqlite` using two tables:

### Trips Table (`trips`)

| Column Name | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique ID |
| `name` | TEXT | NOT NULL | Name of the trip (e.g., Hong Kong Trip 2026) |
| `budget_hkd` | REAL | NOT NULL | Total allocated budget in HKD |
| `exchange_rate` | REAL | NOT NULL | Exchange rate (1 HKD = X PHP) |
| `duration_days` | INTEGER | DEFAULT 7 | Trip duration in days |
| `currency_preference` | TEXT | DEFAULT 'PHP' | Primary display currency |
| `created_at` | INTEGER | NOT NULL | Unix timestamp of creation |

### Expenses Table (`expenses`)

| Column Name | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique ID |
| `trip_id` | TEXT | NOT NULL | Foreign key referencing `trips.id` |
| `php_amount` | REAL | NOT NULL | Transaction amount in PHP |
| `category` | TEXT | NOT NULL | Expense category (Food, Transport, etc.) |
| `note` | TEXT | NOT NULL | Merchant name or description |
| `date` | INTEGER | NOT NULL | Transaction timestamp |
| `source` | TEXT | DEFAULT 'manual' | Source of log (`manual`, `qr`, `ocr`, `import`) |
| `created_at` | INTEGER | NOT NULL | Unix timestamp of record creation |

---

## Setup and Installation

### Prerequisites

* Node.js (version 18 or later recommended)
* npm or yarn package manager
* EAS CLI installed globally (`npm install -g eas-cli`)
* Android Studio (for emulator testing) or a physical Android test device running the Expo Orbit/Expo Go application

### 1. Backend Setup

From the repository root, install dependencies and run the local proxy:

```bash
cd backend
npm install
```

### 2. Frontend Setup

From the repository root, navigate to the frontend folder, install dependencies, and configure environment variables:

```bash
cd frontend
npm install
```

### 3. Generate Native Development Build (EAS Build)

Because this project utilizes native camera interfaces (`expo-camera`) and native machine learning runtimes (`@react-native-ml-kit/text-recognition`), it cannot be run inside standard Expo Go. You must build a custom Development Client.

To build the development build for Android via EAS Cloud:

```bash
cd frontend
eas build --profile development --platform android
```

After the command completes, download and install the resulting APK file onto your Android device or drag-and-drop it into an Android Studio emulator.

### 4. Running the Development Server

Start the local Metro Bundler:

```bash
cd frontend
npx expo start --tunnel
```

Use your device to scan the Metro QR code or link the running local bundler to your newly installed Development Client APK to begin testing.
