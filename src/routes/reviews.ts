import { Router } from "express";
import { ObjectId } from "mongodb";
import { reviewsCollection, type Review } from "../models/review.js";
import { ordersCollection } from "../models/order.js";
import { requireSession } from "../middleware/auth.js";

const router = Router();

router.post("/", requireSession, async (req, res) => {
  try {
    const { animalId, orderId, rating, comment } = req.body;
    const userId = req.user!.id;

    if (!animalId || !orderId || !rating) {
      res.status(400).json({ message: "animalId, orderId, and rating are required" });
      return;
    }

    if (!ObjectId.isValid(animalId) || !ObjectId.isValid(orderId)) {
      res.status(400).json({ message: "Invalid animalId or orderId" });
      return;
    }

    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
      return;
    }

    const order = await ordersCollection().findOne({ _id: new ObjectId(orderId) });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    if (order.buyerId !== userId) {
      res.status(403).json({ message: "You can only review your own orders" });
      return;
    }

    if (order.status !== "paid") {
      res.status(400).json({ message: "You can only review paid orders" });
      return;
    }

    if (order.animalId !== animalId) {
      res.status(400).json({ message: "OrderId does not match this animal" });
      return;
    }

    const existing = await reviewsCollection().findOne({ orderId });
    if (existing) {
      res.status(400).json({ message: "You have already reviewed this order" });
      return;
    }

    const review: Review = {
      userId,
      animalId,
      orderId,
      rating: numRating,
      comment: comment || "",
      createdAt: new Date(),
    };

    const result = await reviewsCollection().insertOne(review);

    res.status(201).json({
      message: "Review submitted",
      review: { ...review, _id: result.insertedId },
    });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/animal/:animalId", async (req, res) => {
  try {
    const { animalId } = req.params;

    if (!ObjectId.isValid(animalId)) {
      res.status(400).json({ message: "Invalid animal ID" });
      return;
    }

    const reviews = await reviewsCollection()
      .find({ animalId })
      .sort({ createdAt: -1 })
      .toArray();

    const total = reviews.length;
    const avgRating = total > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
      : 0;

    res.json({ reviews, averageRating: avgRating, total });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/check", requireSession, async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId || typeof orderId !== "string") {
      res.status(400).json({ message: "orderId query parameter is required" });
      return;
    }

    const existing = await reviewsCollection().findOne({ orderId });
    res.json({ reviewed: !!existing, review: existing || null });
  } catch (err) {
    console.error("Error checking review:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
