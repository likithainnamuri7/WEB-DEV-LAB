// index.mjs
// Express application entry point
import "./loadEnvironment.mjs";
import express from "express";
import cors from "cors";
import { connectDB } from "./db/conn.mjs";
import postsRouter from "./routes/posts.mjs";

const app = express();
const PORT = process.env.PORT || 5050;

// ── Middleware ────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────
app.use("/posts", postsRouter);

// ── Health check ──────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Blog API is running 🚀" });
});

// ── 404 handler ───────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ── Start server ──────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
