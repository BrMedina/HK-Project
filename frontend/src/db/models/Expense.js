import { Model } from "@nozbe/watermelondb";
import { field, date, relation } from "@nozbe/watermelondb/decorators";

export default class Expense extends Model {
  static table = "expenses";
  static associations = {
    trips: { type: "belongs_to", key: "trip_id" },
  };

  @field("php_amount") phpAmount;
  @field("category") category;
  @field("note") note;
  @date("date") transactionDate;
  @field("source") source;
  @date("created_at") createdAt;

  @relation("trips", "trip_id") trip;
}
