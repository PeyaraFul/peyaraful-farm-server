import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export interface Review {
  _id?: ObjectId;
  userId: string;
  animalId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const COLLECTION = "reviews";

export function reviewsCollection() {
  return getDB().collection<Review>(COLLECTION);
}
