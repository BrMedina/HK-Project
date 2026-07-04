import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://api.frankfurter.dev/v1/latest";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours — Frankfurter updates ~once/day around 16:00 CET

async function getCached(key: string): Promise<any | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const { data, fetchedAt } = JSON.parse(raw);
    if (Date.now() - fetchedAt > CACHE_TTL_MS) return null;
    return data;
  } catch (e) {
    return null;
  }
}

async function setCached(key: string, data: any): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ data, fetchedAt: Date.now() }));
  } catch (e) {
    // ignore write failures, caching is best-effort
  }
}

async function getStaleFallback(key: string): Promise<any | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw).data;
  } catch (e) {
    return null;
  }
}

interface ExchangeRateResult {
  rate: number;
  date: string;
  fromCache: boolean;
  stale?: boolean;
}

// Fetch the exchange rate between two currencies, e.g. fetchExchangeRate("HKD", "PHP")
// Returns { rate, date, fromCache } — rate is "1 <from> = rate <to>"
export async function fetchExchangeRate(from = "HKD", to = "PHP"): Promise<ExchangeRateResult> {
  const cacheKey = `frankfurter:${from}:${to}`;
  const cached = await getCached(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const res = await fetch(`${BASE_URL}?from=${from}&to=${to}`);
  if (!res.ok) {
    const stale = await getStaleFallback(cacheKey);
    if (stale) return { ...stale, fromCache: true, stale: true };
    throw new Error(`Frankfurter request failed: ${res.status}`);
  }
  const json = await res.json();
  const result = { rate: json.rates[to], date: json.date };
  await setCached(cacheKey, result);
  return { ...result, fromCache: false };
}

// Convenience helper for converting an amount directly
export async function convert(amount: number, from = "PHP", to = "HKD"): Promise<number> {
  const { rate } = await fetchExchangeRate(from, to);
  return Number((amount * rate).toFixed(2));
}
