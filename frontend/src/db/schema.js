import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "trips",
      columns: [
        { name: "name", type: "string" },
        { name: "budget_hkd", type: "number" },
        { name: "exchange_rate", type: "number" },
        { name: "created_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "expenses",
      columns: [
        { name: "trip_id", type: "string", isIndexed: true },
        { name: "php_amount", type: "number" },
        { name: "category", type: "string" },
        { name: "note", type: "string" },
        { name: "date", type: "number" },
        { name: "source", type: "string" },
        { name: "created_at", type: "number" },
      ],
    }),
  ],
});
