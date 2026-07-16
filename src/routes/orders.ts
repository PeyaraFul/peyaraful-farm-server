import { Router } from "express";
import { ObjectId } from "mongodb";
import { ordersCollection, type Order } from "../models/order.js";
import { animalsCollection } from "../models/animal.js";
import { requireSession, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", requireSession, async (req, res) => {
  try {
    const { animalId } = req.body;
    const buyerId = req.user!.id;

    if (!animalId) {
      res.status(400).json({ message: "animalId is required" });
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

router.get("/", requireSession, async (req, res) => {
  try {
    const buyerId = req.user!.id;

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

router.get("/all", requireAdmin, async (_req, res) => {
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

router.patch("/:id/confirm", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid order ID" });
      return;
    }

    const order = await ordersCollection().findOne({ _id: new ObjectId(id) });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    if (order.status !== "pending") {
      res.status(400).json({ message: "Only pending orders can be confirmed" });
      return;
    }

    await ordersCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "paid" } }
    );

    res.json({ message: "Order confirmed" });
  } catch (err) {
    console.error("Error confirming order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid order ID" });
      return;
    }

    const order = await ordersCollection().findOne({ _id: new ObjectId(id) });

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    await ordersCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "cancelled" } }
    );

    await animalsCollection().updateOne(
      { _id: new ObjectId(order.animalId) },
      { $set: { status: "available" } }
    );

    res.json({ message: "Order cancelled" });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
