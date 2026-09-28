// src/pages/Post.jsx
// Displays a single blog post in full
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchPost, deletePost } from "../api.js";

export default function Post() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetchPost(id)
      .then(setPost)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="spinner" />;
  if (error)   return <div className="alert alert-error">{error}</div>;
  if (!post)   return null;

  const createdDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const updatedDate = new Date(post.updatedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <Link to="/" className="btn btn-back" style={{ marginBottom: "1.25rem", display: "inline-flex" }}>
        ← Back to Posts
      </Link>

      <div className="post-full">
        <h1 className="post-full-title">{post.title}</h1>
        <p className="post-full-meta">
          By <strong>{post.author}</strong> &bull; Published {createdDate}
          {createdDate !== updatedDate && ` · Updated ${updatedDate}`}
        </p>

        <div className="post-full-content">{post.content}</div>

        <div className="post-full-actions">
          <Link to={`/post/${id}/edit`} className="btn btn-outline">
            ✏️ Edit Post
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            🗑️ Delete Post
          </button>
        </div>
      </div>
    </>
  );
}
