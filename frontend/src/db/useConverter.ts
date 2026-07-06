import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { getAllTrips, updateTripExchangeRate } from "./queries";
import { fetchExchangeRate } from "../api/currency";

// ---------------------------------------------------------------------------
// Types (re-exported so components can use them)
// ---------------------------------------------------------------------------

export type Trip = {
  id: string;
  name: string;
  budget_hkd: number;
  exchange_rate: number;
  created_at: number;
  duration_days?: number;
  currency_preference?: string;
};

export type RateEntry = {
  id: string;
  date: string;
  rate: number;
  isCurrent: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateLabel(d: Date): string {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${months[d.getMonth()]} ${d.getDate()}, ${hh}:${mm}`;
}

function buildInitialHistory(currentRate: number): RateEntry[] {
  const now = new Date();
  return [
    { id: "1", date: formatDateLabel(now), rate: currentRate, isCurrent: true },
    { id: "2", date: formatDateLabel(new Date(now.getTime() - 86400000)), rate: +(currentRate - 0.03).toFixed(2), isCurrent: false },
    { id: "3", date: formatDateLabel(new Date(now.getTime() - 172800000)), rate: +(currentRate + 0.03).toFixed(2), isCurrent: false },
  ];
}

const sanitize = (t: string) => t.replace(/[^0-9.]/g, "");

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useConverter() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [rate, setRate] = useState(7.84);
  const [rateHistory, setRateHistory] = useState<RateEntry[]>([]);

  const [phpValue, setPhpValue] = useState("1000");
  const [hkdValue, setHkdValue] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);

  const [customRateInput, setCustomRateInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ---- Load trip ----
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const trips = (await getAllTrips()) as Trip[];
        if (trips.length > 0) {
          const active = trips[0];
          setTrip(active);
          setRate(active.exchange_rate);
          setCustomRateInput(active.exchange_rate.toString());
          setRateHistory(buildInitialHistory(active.exchange_rate));
        }
      } catch (err) {
        console.error("useConverter init error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---- Conversion helpers ----
  const toHkd = useCallback(
    (php: string) => {
      const n = parseFloat(php);
      setHkdValue(!isNaN(n) && rate > 0 ? (n / rate).toFixed(2) : "");
    },
    [rate],
  );

  const toPhp = useCallback(
    (hkd: string) => {
      const n = parseFloat(hkd);
      setPhpValue(!isNaN(n) ? (n * rate).toFixed(2) : "");
    },
    [rate],
  );

  // Re-convert on rate change
  useEffect(() => { isSwapped ? toPhp(hkdValue) : toHkd(phpValue); }, [rate]);
  // Initial conversion after load
  useEffect(() => { if (!loading && rate > 0) toHkd("1000"); }, [loading]);

  const handlePhpChange = (t: string) => { const c = sanitize(t); setPhpValue(c); toHkd(c); };
  const handleHkdChange = (t: string) => { const c = sanitize(t); setHkdValue(c); toPhp(c); };

  const handleSwap = () => {
    setIsSwapped((p) => !p);
    const tmp = phpValue;
    setPhpValue(hkdValue);
    setHkdValue(tmp);
  };

  // ---- Save custom rate ----
  const handleSaveRate = async () => {
    if (!trip) return;
    const parsed = parseFloat(customRateInput);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert("Invalid rate", "Please enter a positive number.");
      return;
    }
    try {
      setSaving(true);
      await updateTripExchangeRate(trip.id, parsed);
      setRate(parsed);
      setTrip({ ...trip, exchange_rate: parsed });
      setRateHistory((prev) => [
        { id: Date.now().toString(), date: formatDateLabel(new Date()), rate: parsed, isCurrent: true },
        ...prev.map((e) => ({ ...e, isCurrent: false })),
      ]);
    } catch (err) {
      console.error("Failed to save rate:", err);
      Alert.alert("Error", "Could not save rate.");
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshRate = async () => {
    if (!trip) return;
    try {
      setRefreshing(true);
      const result = await fetchExchangeRate("HKD", "PHP", true);
      setRate(result.rate);
      setTrip({ ...trip, exchange_rate: result.rate });
      setCustomRateInput(result.rate.toString());
      await updateTripExchangeRate(trip.id, result.rate);
      setRateHistory((prev) => [
        { id: Date.now().toString(), date: formatDateLabel(new Date()), rate: result.rate, isCurrent: true },
        ...prev.map((e) => ({ ...e, isCurrent: false })),
      ]);
    } catch (err) {
      console.error("Failed to refresh rate:", err);
      Alert.alert("Error", "Could not refresh live rate.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleResetHistory = () => { if (trip) setRateHistory(buildInitialHistory(rate)); };

  const handleCustomRateChange = (t: string) => setCustomRateInput(sanitize(t));

  return {
    trip, loading, rate, rateHistory,
    phpValue, hkdValue, isSwapped,
    customRateInput, saving, refreshing,
    handlePhpChange, handleHkdChange, handleSwap,
    handleSaveRate, handleResetHistory, handleCustomRateChange, handleRefreshRate,
  };
}
