import { Router } from "express";
import { contactMessagesCollection, type ContactMessage } from "../models/contact.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: "name, email, and message are required" });
      return;
    }

    if (typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ message: "A valid email is required" });
      return;
    }

    const doc: ContactMessage = {
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      createdAt: new Date(),
    };

    const result = await contactMessagesCollection().insertOne(doc);

    res.status(201).json({
      message: "Message sent successfully",
      contact: { ...doc, _id: result.insertedId },
    });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const messages = await contactMessagesCollection()
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(messages);
  } catch (err) {
    console.error("Error fetching contact messages:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
