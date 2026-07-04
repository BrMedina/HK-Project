# Gala Fund — GCash Trip Tracker for Hong Kong

**Tagline:** Track every peso you spend on your gala, straight from your GCash wallet.

## Overview

Gala Fund is a trip expense tracker built for Filipino tourists spending PHP through GCash while traveling in Hong Kong. It gives travelers a single dashboard to see their budget, spending by category, and recent transactions in both PHP and HKD — without needing an account, cloud sync, or access to GCash's systems.

Since GCash has no public API for reading a user's personal transactions, Gala Fund is built around fast, low-friction ways to log spending yourself: a QR-assisted quick-add for in-person payments, manual entry, and import from GCash's own Passbook export.

## Home Dashboard

The home screen is the trip command center:

- **Trip header** — trip name, route shown as *From Philippines → Hong Kong*, with a live local weather chip for Hong Kong so travelers can plan their day at a glance.
- **Total Budget card** — shows the total trip budget (e.g. PHP 30,000), amount spent, percentage used, and a circular progress ring with a wallet icon. Remaining balance is shown clearly in green so travelers always know what's left.
- **Quick Overview** — four category tiles (Food, Transport, Shopping, Activities) each showing total spent and share of overall spending, color-coded and icon-led for fast scanning.
- **Recent Transactions** — a running list of the latest logged expenses (e.g. MTR Octopus Card Top-up, DimDimSum Tsim Sha Tsui, Miniso Nathan Road, The Peak Tram), each with merchant name, date, category, and amount in PHP.
- **Floating add button** — a single tap opens the quick-add flow from anywhere on the dashboard.
- **Bottom navigation** — Overview, Transactions, Budget, Converter, and Tips, so budgeting, currency conversion, and travel tips live alongside the spending log rather than in a separate app.

## How Logging Works: QR-Assisted Quick-Add

This is the core interaction the app is built around:

1. When paying a merchant, the traveler scans the merchant's GCash payment QR code using Gala Fund's own camera scanner — independently of the GCash app.
2. Gala Fund reads the QR PH / EMVCo payload and pulls out the merchant name and merchant ID automatically.
3. A pre-filled entry appears — merchant name already in place — and the traveler just confirms the amount and category, then taps save.
4. The traveler still completes the actual payment inside the GCash app as normal. Gala Fund isn't connected to that payment and can't confirm it went through — it simply removes the need to type the merchant name by hand, turning logging into a 2-second confirmation instead of manual entry.

For transactions without a QR code (cash, non-GCash spend, or anything after the fact), the traveler can also:
- **Add manually** — amount, category, note, and date.
- **Import GCash Passbook history** — export transaction history from the GCash app and upload the file to bulk-import past spending, reviewing and categorizing each row before confirming.

## Export Page

Once a trip is logged, travelers can export everything they've tracked in Gala Fund — useful for reimbursement claims, sharing costs with a travel companion, or just keeping a personal record after the trip. Two export formats are available:

- **Excel (.xlsx)** — every logged transaction as a row (date, merchant/note, category, PHP amount, HKD equivalent), plus a summary sheet totaling spend by category and against the trip budget. Good for travelers who want to filter, sort, or build their own charts afterward.
- **PDF summary** — a clean, printable one-page (or multi-page) report: trip name and dates, total budget vs. total spent, a category breakdown, and the full transaction list — styled like a simple trip expense report rather than a raw data dump. Good for submitting as a reimbursement/liquidation report or sharing with family.

The traveler can choose to export the whole trip or a filtered date range/category before generating either file.

## Currency Handling

- All expenses are entered in PHP and converted to HKD using an editable exchange rate the traveler sets themselves (no live rate-fetching, since the app works fully offline/on-device).
- The Converter tab lets travelers quickly check PHP ↔ HKD amounts on the fly, e.g. before agreeing to a price while shopping.

## What It Doesn't Do

To set expectations clearly:
- No live connection to GCash — it cannot read wallet balance or verify a payment succeeded.
- No cloud account required — data stays on the device.
- The QR scan identifies the *merchant*, not the *transaction amount or outcome* — the traveler still confirms both manually.

## Design Direction

Clean, light dashboard styling suited to daily glance-and-go use while traveling: soft category color tiles, a wallet-themed progress ring for budget status, and a friendly Hong Kong skyline header to anchor the trip context — prioritizing quick scanning over dense data tables, since the primary user is on the move between meals, transit taps, and shop counters.

## Target User

Filipino tourists on short Hong Kong trips (leisure or family visits) who spend primarily via GCash and want a lightweight way to see, in real time, how much of their trip budget is left — in both PHP and HKD — without manually reconciling GCash screenshots after the trip.
