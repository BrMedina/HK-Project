import { Model } from "@nozbe/watermelondb";
import { field, date, children } from "@nozbe/watermelondb/decorators";

export default class Trip extends Model {
  static table = "trips";
  static associations = {
    expenses: { type: "has_many", foreignKey: "trip_id" },
  };

  @field("name") name;
  @field("budget_hkd") budgetHkd;
  @field("exchange_rate") exchangeRate;
  @date("created_at") createdAt;

  @children("expenses") expenses;
}
