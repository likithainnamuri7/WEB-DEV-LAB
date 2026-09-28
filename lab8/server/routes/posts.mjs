// routes/posts.mjs
// Express router – full CRUD for blog posts
import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db/conn.mjs";

const router = express.Router();
const COLLECTION = "posts";

// ──────────────────────────────────────────────
// Helper: get the posts collection
// ──────────────────────────────────────────────
async function postsCollection() {
  const db = await getDB();
  return db.collection(COLLECTION);
}

// ──────────────────────────────────────────────
// GET /posts  →  return all posts (newest first)
// ──────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const col = await postsCollection();
    const posts = await col
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

// ──────────────────────────────────────────────
// GET /posts/:id  →  return a single post by id
// ──────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const col = await postsCollection();
    const post = await col.findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch post." });
  }
});

// ──────────────────────────────────────────────
// POST /posts  →  create a new post
// Body: { title, content, author? }
// ──────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { title, content, author = "Anonymous" } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }
    const newPost = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const col = await postsCollection();
    const result = await col.insertOne(newPost);
    res.status(201).json({ ...newPost, _id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post." });
  }
});

// ──────────────────────────────────────────────
// PUT /posts/:id  →  update an existing post
// Body: { title?, content?, author? }
// ──────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const updates = { updatedAt: new Date() };
    if (title)   updates.title   = title.trim();
    if (content) updates.content = content.trim();
    if (author)  updates.author  = author.trim();

    if (Object.keys(updates).length === 1) {
      return res.status(400).json({ error: "No valid fields provided to update." });
    }

    const col = await postsCollection();
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updates },
      { returnDocument: "after" }
    );
    if (!result) return res.status(404).json({ error: "Post not found." });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update post." });
  }
});

// ──────────────────────────────────────────────
// DELETE /posts/:id  →  remove a post
// ──────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const col = await postsCollection();
    const result = await col.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.json({ message: "Post deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete post." });
  }
});

export default router;
