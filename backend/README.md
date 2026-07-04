# Gala Fund — API integration layer

This folder contains only external API calls with local caching — weather and
currency exchange. There is no database or persistence logic here; trip and
expense storage lives entirely in the `frontend/` folder.

## Setup

`cd backend && npm install`

No native build step is required — these are plain fetch calls plus AsyncStorage
caching, so they work fine inside Expo Go.

## Usage

Weather (Hong Kong Observatory, no API key required):
```js
import { fetchCurrentWeather, fetchWarnings, fetchNineDayForecast } from "./src/api/weather";

const { data: current } = await fetchCurrentWeather();
const { data: warnings } = await fetchWarnings();
```
Cached 30 minutes, falls back to the last cached value if the request fails (e.g. no signal).

Currency (Frankfurter, ECB reference rates, no API key required):
```js
import { fetchExchangeRate, convert } from "./src/api/currency";

const { rate, date } = await fetchExchangeRate("HKD", "PHP"); // 1 HKD = rate PHP
const hkdValue = await convert(250, "PHP", "HKD");
```
Cached 6 hours since rates update about once a day, with the same stale-fallback behavior.

## Notes for the agent wiring this into the app

- These functions are pure — they take/return plain values and don't touch the
  frontend's storage layer. Call them from the frontend, then pass the result
  into whatever save/update function the frontend database already exposes
  (e.g. storing the fetched rate on a trip record when it's created or refreshed).
- Don't add any database, ORM, or persistence code to this folder — that's already
  implemented in `frontend/`.
