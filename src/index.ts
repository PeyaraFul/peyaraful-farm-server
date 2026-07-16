import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { getAuth } from "./config/auth.js";
import animalsRoutes from "./routes/animals.js";
import ordersRoutes from "./routes/orders.js";
import reviewsRoutes from "./routes/reviews.js";
import contactRoutes from "./routes/contact.js";
import favoritesRoutes from "./routes/favorites.js";

export const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.all("/api/auth/*", async (req, res) => {
  const auth = getAuth();
  await auth.handler(req as any, res as any);
});

app.use("/api/animals", animalsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/favorites", favoritesRoutes);

async function start() {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
