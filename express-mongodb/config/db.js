import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "library";

const client = new MongoClient(uri);
let db;

export const connectDB = async () => {
  await client.connect();
  db = client.db(dbName);
  console.log(`Connected to MongoDB database: ${dbName}`);
  return db;
};

export const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};
