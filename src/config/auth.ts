import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDB } from "./db.js";

let _auth: ReturnType<typeof betterAuth> | null = null;

export function getAuth() {
  if (!_auth) {
    _auth = betterAuth({
      baseURL: process.env.CLIENT_URL || "http://localhost:3000",
      secret: process.env.BETTER_AUTH_SECRET!,
      database: mongodbAdapter(getDB()),
      emailAndPassword: {
        enabled: true,
      },
      user: {
        additionalFields: {
          role: {
            type: "string",
            required: false,
            defaultValue: "user",
            input: false,
          },
        },
      },
    });
  }
  return _auth;
}
