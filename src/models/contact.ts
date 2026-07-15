import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

export interface ContactMessage {
  _id?: ObjectId;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const COLLECTION = "contact_messages";

export function contactMessagesCollection() {
  return getDB().collection<ContactMessage>(COLLECTION);
}
