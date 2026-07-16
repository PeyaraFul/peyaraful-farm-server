import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDB } from "./db.js";

let _auth: any = null;

export function getAuth() {
  if (!_auth) {
    _auth = betterAuth({
      baseURL: (process.env.BASE_URL || "http://localhost:4001") + "/api/auth",
      secret: process.env.BETTER_AUTH_SECRET!,
      trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],
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
