import { Router } from "express";
import { ObjectId } from "mongodb";
import { favoritesCollection } from "../models/favorite.js";
import { animalsCollection } from "../models/animal.js";
import { requireSession } from "../middleware/auth.js";

const router = Router();

router.get("/", requireSession, async (req, res) => {
  try {
    const userId = req.user!.id;

    const favorites = await favoritesCollection()
      .find({ userId })
      .toArray();

    const animalIds = favorites.map((f) => f.animalId);

    const animals = await animalsCollection()
      .find({ _id: { $in: animalIds.map((id) => new ObjectId(id)) } })
      .toArray();

    res.json(animals);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/toggle", requireSession, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { animalId } = req.body;

    if (!animalId) {
      res.status(400).json({ message: "animalId is required" });
      return;
    }

    const existing = await favoritesCollection().findOne({ userId, animalId });

    if (existing) {
      await favoritesCollection().deleteOne({ userId, animalId });
      res.json({ favorited: false });
    } else {
      await favoritesCollection().insertOne({ userId, animalId });
      res.json({ favorited: true });
    }
  } catch (err) {
    console.error("Error toggling favorite:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
