import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export interface Favorite {
  _id?: ObjectId;
  userId: string;
  animalId: string;
}

const COLLECTION = "favorites";

export function favoritesCollection() {
  return getDB().collection<Favorite>(COLLECTION);
}
