import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export interface Order {
  _id?: ObjectId;
  buyerId: string;
  animalId: string;
  price: number;
  status: "pending" | "paid" | "cancelled";
  createdAt: Date;
}

const COLLECTION = "orders";

export function ordersCollection() {
  return getDB().collection<Order>(COLLECTION);
}
