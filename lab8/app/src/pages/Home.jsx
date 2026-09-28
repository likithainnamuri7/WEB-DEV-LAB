// src/pages/Home.jsx
// Displays all posts as cards; supports inline delete
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import PostSummary from "../components/PostSummary.jsx";
import { fetchPosts, deletePost } from "../api.js";

export default function Home() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="spinner" />;
  if (error)   return <div className="alert alert-error">{error}</div>;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Latest Posts</h1>
        <Link to="/create" className="btn btn-primary">+ New Post</Link>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet. Be the first to write one!</p>
          <Link to="/create" className="btn btn-primary">Create Post</Link>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostSummary key={post._id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </>
  );
}
