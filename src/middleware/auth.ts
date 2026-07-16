import { Request, Response, NextFunction } from "express";
import { getAuth } from "../config/auth.js";

export async function requireSession(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = getAuth()!;
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Headers,
    });

    if (!session?.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired session" });
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = getAuth()!;
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Headers,
    });

    if (!session?.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if ((session.user as Record<string, unknown>).role !== "admin") {
      res.status(403).json({ message: "Admin access required" });
      return;
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired session" });
  }
}
