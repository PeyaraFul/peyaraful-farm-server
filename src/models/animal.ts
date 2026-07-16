import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export interface Animal {
  _id?: ObjectId;
  name: string;
  type: "cow" | "buffalo";
  breed: string;
  age: number;
  weight: number;
  price: number;
  color: string;
  imageUrl: string;
  shortDescription: string;
  description: string;
  status: "available" | "sold";
  sellerId: string;
  createdAt: Date;
}

const COLLECTION = "animals";

export function animalsCollection() {
  return getDB().collection<Animal>(COLLECTION);
}
