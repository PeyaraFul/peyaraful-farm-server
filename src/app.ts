import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { getAuth } from "./config/auth.js";
import animalsRoutes from "./routes/animals.js";
import ordersRoutes from "./routes/orders.js";
import reviewsRoutes from "./routes/reviews.js";
import contactRoutes from "./routes/contact.js";
import favoritesRoutes from "./routes/favorites.js";

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.all("/api/auth/{*path}", async (req, res) => {
  const auth = getAuth();
  await auth.handler(req as any, res as any);
});

app.use("/api/animals", animalsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/favorites", favoritesRoutes);

export { app };
