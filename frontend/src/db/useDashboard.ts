import { useState, useEffect } from "react";
import { getAllTrips, createTrip, getExpensesForTrip, getTotalSpentPHP, getTotalsByCategory } from "./queries";

const DEFAULT_TRIP_NAME = "Hong Kong Trip";
const DEFAULT_BUDGET_HKD = 5000;
const DEFAULT_EXCHANGE_RATE = 7.84; // 1 HKD ≈ 7.84 PHP

export type Trip = {
  id: string;
  name: string;
  budget_hkd: number;
  exchange_rate: number;
  created_at: number;
  duration_days?: number;
  currency_preference?: string;
};

export type Expense = {
  id: string;
  trip_id: string;
  note: string;
  category: string;
  php_amount: number;
  date: number | null;
  source: string;
};

export type CategoryTotals = { [key: string]: number };

export function useDashboard() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotals>({});
  const [loading, setLoading] = useState(true);

  const budgetPhp = trip ? trip.budget_hkd * trip.exchange_rate : 0;
  const remainingPhp = budgetPhp - totalSpent;
  const spentPercent = budgetPhp > 0 ? Math.round((totalSpent / budgetPhp) * 100) : 0;

  const loadData = async (currentTrip: Trip) => {
    const [expenseList, totalSpentAmount, catTotals] = await Promise.all([
      getExpensesForTrip(currentTrip.id),
      getTotalSpentPHP(currentTrip.id),
      getTotalsByCategory(currentTrip.id),
    ]);
    setExpenses(expenseList as Expense[]);
    setTotalSpent(totalSpentAmount as number);
    setCategoryTotals(catTotals as CategoryTotals);
  };

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const trips = (await getAllTrips()) as Trip[];
        let activeTrip: Trip;

        if (trips.length === 0) {
          activeTrip = (await createTrip(DEFAULT_TRIP_NAME, DEFAULT_BUDGET_HKD, DEFAULT_EXCHANGE_RATE)) as unknown as Trip;
        } else {
          activeTrip = trips[0];
        }

        setTrip(activeTrip);
        await loadData(activeTrip);
      } catch (err) {
        console.error("useDashboard init error:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const refresh = async () => {
    if (trip) await loadData(trip);
  };

  return {
    trip,
    expenses,
    totalSpent,
    categoryTotals,
    budgetPhp,
    remainingPhp,
    spentPercent,
    loading,
    refresh,
  };
}
