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
  const baseURL = process.env.BASE_URL || "http://localhost:4001";
  const url = `${baseURL}${req.originalUrl}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }
  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await new Response(req as any).arrayBuffer();
  const request = new Request(url, {
    method: req.method,
    headers,
    body: body ? Buffer.from(body) : undefined,
  });
  const response = await auth.api.handler(request);
  res.status(response.status);
  response.headers.forEach((v, k) => res.setHeader(k, v));
  const resBody = await response.text();
  res.send(resBody);
});

app.use("/api/animals", animalsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/favorites", favoritesRoutes);

export { app };
