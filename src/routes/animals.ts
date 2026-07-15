import { Router } from "express";
import { ObjectId } from "mongodb";
import { animalsCollection, type Animal } from "../models/animal.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { search, type, page = "1", limit = "8" } = req.query;

    const filter: Record<string, unknown> = {};

    if (search && typeof search === "string") {
      filter.name = { $regex: search, $options: "i" };
    }

    if (type && (type === "cow" || type === "buffalo")) {
      filter.type = type;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [animals, total] = await Promise.all([
      animalsCollection()
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray(),
      animalsCollection().countDocuments(filter),
    ]);

    res.json({
      animals,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("Error fetching animals:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      type,
      breed,
      age,
      weight,
      price,
      color,
      imageUrl,
      description,
      sellerId,
    } = req.body;

    if (!name || !type || !breed || !price) {
      res.status(400).json({ message: "name, type, breed, and price are required" });
      return;
    }

    if (type !== "cow" && type !== "buffalo") {
      res.status(400).json({ message: "type must be 'cow' or 'buffalo'" });
      return;
    }

    const animal: Animal = {
      name,
      type,
      breed,
      age: age || 0,
      weight: weight || 0,
      price,
      color: color || "",
      imageUrl: imageUrl || "",
      description: description || "",
      status: "available",
      sellerId: sellerId || "",
      createdAt: new Date(),
    };

    const result = await animalsCollection().insertOne(animal);

    res.status(201).json({
      message: "Animal created successfully",
      animal: { ...animal, _id: result.insertedId },
    });
  } catch (err) {
    console.error("Error creating animal:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
