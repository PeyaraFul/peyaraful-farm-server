import { connectDB } from "../src/config/db.js";

let isConnected = false;

async function ensureDB() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

export default async function handler(req: any, res: any) {
  await ensureDB();

  const { app } = await import("../src/index.js");
  return app(req, res);
}
