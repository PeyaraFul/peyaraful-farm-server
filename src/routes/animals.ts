import { Router } from "express";
import { ObjectId } from "mongodb";
import { animalsCollection, type Animal } from "../models/animal.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { search, type, sort = "newest", page = "1", limit = "8" } = req.query;

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

    let sortStage: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "price_asc") sortStage = { price: 1 };
    else if (sort === "price_desc") sortStage = { price: -1 };

    const [animals, total] = await Promise.all([
      animalsCollection()
        .find(filter)
        .sort(sortStage)
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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid animal ID" });
      return;
    }

    const animal = await animalsCollection().findOne({ _id: new ObjectId(id) });

    if (!animal) {
      res.status(404).json({ message: "Animal not found" });
      return;
    }

    res.json(animal);
  } catch (err) {
    console.error("Error fetching animal:", err);
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

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid animal ID" });
      return;
    }

    const existing = await animalsCollection().findOne({ _id: new ObjectId(id) });
    if (!existing) {
      res.status(404).json({ message: "Animal not found" });
      return;
    }

    const { name, type, breed, age, weight, price, color, imageUrl, description, status } = req.body;

    if (type && type !== "cow" && type !== "buffalo") {
      res.status(400).json({ message: "type must be 'cow' or 'buffalo'" });
      return;
    }

    if (status && status !== "available" && status !== "sold") {
      res.status(400).json({ message: "status must be 'available' or 'sold'" });
      return;
    }

    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (type !== undefined) update.type = type;
    if (breed !== undefined) update.breed = breed;
    if (age !== undefined) update.age = age;
    if (weight !== undefined) update.weight = weight;
    if (price !== undefined) update.price = price;
    if (color !== undefined) update.color = color;
    if (imageUrl !== undefined) update.imageUrl = imageUrl;
    if (description !== undefined) update.description = description;
    if (status !== undefined) update.status = status;

    await animalsCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    const updated = await animalsCollection().findOne({ _id: new ObjectId(id) });
    res.json({ message: "Animal updated", animal: updated });
  } catch (err) {
    console.error("Error updating animal:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid animal ID" });
      return;
    }

    const existing = await animalsCollection().findOne({ _id: new ObjectId(id) });
    if (!existing) {
      res.status(404).json({ message: "Animal not found" });
      return;
    }

    await animalsCollection().deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Animal deleted" });
  } catch (err) {
    console.error("Error deleting animal:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
