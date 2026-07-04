import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php";
const CACHE_TTL = 30 * 60 * 1000; // 30 min

// ponytail: shared cache helpers — three callers, one implementation
async function getCached(key: string) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const { data, fetchedAt } = JSON.parse(raw);
    return Date.now() - fetchedAt > CACHE_TTL ? null : data;
  } catch { return null; }
}

async function setCached(key: string, data: unknown) {
  try { await AsyncStorage.setItem(key, JSON.stringify({ data, fetchedAt: Date.now() })); }
  catch { /* best-effort */ }
}

async function getStaleFallback(key: string) {
  try { const raw = await AsyncStorage.getItem(key); return raw ? JSON.parse(raw).data : null; }
  catch { return null; }
}

async function hkoFetch(dataType: string, lang = "en") {
  const key = `hko:${dataType}:${lang}`;
  const cached = await getCached(key);
  if (cached) return { data: cached, fromCache: true };
  const res = await fetch(`${BASE_URL}?dataType=${dataType}&lang=${lang}`);
  if (!res.ok) {
    const stale = await getStaleFallback(key);
    if (stale) return { data: stale, fromCache: true, stale: true };
    throw new Error(`HKO ${dataType} failed: ${res.status}`);
  }
  const data = await res.json();
  await setCached(key, data);
  return { data, fromCache: false };
}

// ponytail: three public functions collapse to one generic fetcher
export const fetchCurrentWeather = (lang = "en") => hkoFetch("rhrread", lang);
export const fetchWarnings       = (lang = "en") => hkoFetch("warnsum", lang);
export const fetchNineDayForecast = (lang = "en") => hkoFetch("fnd", lang);
