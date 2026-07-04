import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

async function getCached(key) {
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

async function setCached(key, data) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ data, fetchedAt: Date.now() }));
  } catch (e) {
    // ignore write failures, caching is best-effort
  }
}

async function getStaleFallback(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw).data;
  } catch (e) {
    return null;
  }
}

// Current weather report (rhrread): temperature, humidity, rainfall, general conditions
export async function fetchCurrentWeather({ lang = "en" } = {}) {
  const cacheKey = `hko:rhrread:${lang}`;
  const cached = await getCached(cacheKey);
  if (cached) return { data: cached, fromCache: true };

  const res = await fetch(`${BASE_URL}?dataType=rhrread&lang=${lang}`);
  if (!res.ok) {
    const stale = await getStaleFallback(cacheKey);
    if (stale) return { data: stale, fromCache: true, stale: true };
    throw new Error(`HKO current weather request failed: ${res.status}`);
  }
  const data = await res.json();
  await setCached(cacheKey, data);
  return { data, fromCache: false };
}

// Weather warning summary (warnsum): typhoon signal, rainstorm warning, etc.
export async function fetchWarnings({ lang = "en" } = {}) {
  const cacheKey = `hko:warnsum:${lang}`;
  const cached = await getCached(cacheKey);
  if (cached) return { data: cached, fromCache: true };

  const res = await fetch(`${BASE_URL}?dataType=warnsum&lang=${lang}`);
  if (!res.ok) {
    const stale = await getStaleFallback(cacheKey);
    if (stale) return { data: stale, fromCache: true, stale: true };
    throw new Error(`HKO warnings request failed: ${res.status}`);
  }
  const data = await res.json();
  await setCached(cacheKey, data);
  return { data, fromCache: false };
}

// 9-day forecast (fnd)
export async function fetchNineDayForecast({ lang = "en" } = {}) {
  const cacheKey = `hko:fnd:${lang}`;
  const cached = await getCached(cacheKey);
  if (cached) return { data: cached, fromCache: true };

  const res = await fetch(`${BASE_URL}?dataType=fnd&lang=${lang}`);
  if (!res.ok) {
    const stale = await getStaleFallback(cacheKey);
    if (stale) return { data: stale, fromCache: true, stale: true };
    throw new Error(`HKO forecast request failed: ${res.status}`);
  }
  const data = await res.json();
  await setCached(cacheKey, data);
  return { data, fromCache: false };
}
