import { Request } from "express";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

export interface SessionData {
  id: string;
  userId: string;
  expiresAt: Date;
  [key: string]: unknown;
}

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
      session?: SessionData;
    }
  }
}
