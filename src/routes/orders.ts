import { Router } from "express";
import { ObjectId } from "mongodb";
import { ordersCollection, type Order } from "../models/order.js";
import { animalsCollection } from "../models/animal.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { animalId, buyerId } = req.body;

    if (!animalId || !buyerId) {
      res.status(400).json({ message: "animalId and buyerId are required" });
      return;
    }

    if (!ObjectId.isValid(animalId)) {
      res.status(400).json({ message: "Invalid animal ID" });
      return;
    }

    const animal = await animalsCollection().findOne({
      _id: new ObjectId(animalId),
    });

    if (!animal) {
      res.status(404).json({ message: "Animal not found" });
      return;
    }

    if (animal.status !== "available") {
      res.status(400).json({ message: "This animal is not available for purchase" });
      return;
    }

    const existingOrder = await ordersCollection().findOne({
      animalId,
      status: { $in: ["pending", "paid"] },
    });

    if (existingOrder) {
      res.status(400).json({ message: "This animal already has an active order" });
      return;
    }

    const order: Order = {
      buyerId,
      animalId,
      price: animal.price,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await ordersCollection().insertOne(order);

    await animalsCollection().updateOne(
      { _id: new ObjectId(animalId) },
      { $set: { status: "sold" } }
    );

    res.status(201).json({
      message: "Order placed successfully",
      order: { ...order, _id: result.insertedId },
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { buyerId } = req.query;

    if (!buyerId || typeof buyerId !== "string") {
      res.status(400).json({ message: "buyerId query parameter is required" });
      return;
    }

    const orders = await ordersCollection()
      .find({ buyerId })
      .sort({ createdAt: -1 })
      .toArray();

    const ordersWithAnimals = await Promise.all(
      orders.map(async (order) => {
        const animal = await animalsCollection().findOne({
          _id: new ObjectId(order.animalId),
        });
        return { ...order, animal };
      })
    );

    res.json(ordersWithAnimals);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all", async (_req, res) => {
  try {
    const orders = await ordersCollection()
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const ordersWithAnimals = await Promise.all(
      orders.map(async (order) => {
        const animal = await animalsCollection().findOne({
          _id: new ObjectId(order.animalId),
        });
        return { ...order, animal };
      })
    );

    res.json(ordersWithAnimals);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
