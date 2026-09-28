// db/conn.mjs
// Manages the singleton MongoDB client connection
import "../loadEnvironment.mjs"; // ensure env vars are loaded
import { MongoClient } from "mongodb";

const uri = process.env.ATLAS_URI;
if (!uri) {
  throw new Error("ATLAS_URI is not defined in the .env file.");
}

const client = new MongoClient(uri);

let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(process.env.DB_NAME || "blogdb");
    console.log(`Connected to MongoDB database: ${db.databaseName}`);
  }
  return db;
}

export async function getDB() {
  if (!db) {
    await connectDB();
  }
  return db;
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
