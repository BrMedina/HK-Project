import * as SQLite from "expo-sqlite";

let _db = null;
let _dbPromise = null;

function isReleasedDatabaseError(error) {
  const message = String(error?.message || error || "");
  return message.includes("already released") || message.includes("released shared object");
}

export async function getDB() {
  if (_db) return _db;
  if (_dbPromise) return _dbPromise;

  _dbPromise = (async () => {
    const db = await SQLite.openDatabaseAsync("galafund.db");
    await db.execAsync(`
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
      await db.execAsync("ALTER TABLE trips ADD COLUMN duration_days INTEGER DEFAULT 7;");
    } catch (e) {
      if (!isReleasedDatabaseError(e)) {
        // Column already exists or migration is safe to ignore.
      }
    }
    try {
      await db.execAsync("ALTER TABLE trips ADD COLUMN currency_preference TEXT DEFAULT 'PHP';");
    } catch (e) {
      if (!isReleasedDatabaseError(e)) {
        // Column already exists or migration is safe to ignore.
      }
    }
    try {
      await db.execAsync("ALTER TABLE expenses ADD COLUMN image_uri TEXT;");
    } catch (e) {
      if (!isReleasedDatabaseError(e)) {
        // Column already exists or migration is safe to ignore.
      }
    }

    _db = db;
    return db;
  })();

  try {
    return await _dbPromise;
  } finally {
    _dbPromise = null;
  }
}

export function resetDBCache() {
  _db = null;
  _dbPromise = null;
}

export { isReleasedDatabaseError };
