import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import schema from "./schema";
import Trip from "./models/Trip";
import Expense from "./models/Expense";

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: (error) => {
    console.error("Database setup failed", error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Trip, Expense],
});
