import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "4001", 10),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/peyaraful-farm",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
