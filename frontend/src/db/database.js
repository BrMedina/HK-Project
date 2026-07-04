import * as SQLite from "expo-sqlite";

let _db = null;

export async function getDB() {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync("galafund.db");
  await _db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      budget_hkd REAL NOT NULL,
      exchange_rate REAL NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      php_amount REAL NOT NULL,
      category TEXT NOT NULL,
      note TEXT NOT NULL,
      date INTEGER NOT NULL,
      source TEXT NOT NULL DEFAULT 'manual',
      created_at INTEGER NOT NULL
    );
  `);

  // Migrate: add columns to trips if they do not exist
  try {
    await _db.execAsync("ALTER TABLE trips ADD COLUMN duration_days INTEGER DEFAULT 7;");
  } catch (e) {
    // Column already exists
  }
  try {
    await _db.execAsync("ALTER TABLE trips ADD COLUMN currency_preference TEXT DEFAULT 'PHP';");
  } catch (e) {
    // Column already exists
  }

  return _db;
}
