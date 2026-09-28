// src/pages/Archive.jsx
// Tabular archive of all posts, sorted newest-first
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPosts, deletePost } from "../api.js";

export default function Archive() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
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
        <h1 className="page-title" style={{ marginBottom: 0 }}>Post Archive</h1>
        <Link to="/create" className="btn btn-primary">+ New Post</Link>
      </div>

      <p className="page-subtitle">{posts.length} post{posts.length !== 1 ? "s" : ""} total</p>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts found.</p>
          <Link to="/create" className="btn btn-primary">Create First Post</Link>
        </div>
      ) : (
        <table className="archive-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post._id}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/post/${post._id}`}>{post.title}</Link>
                </td>
                <td>{post.author}</td>
                <td>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <Link to={`/post/${post._id}/edit`} className="btn btn-outline" style={{ padding: "0.25rem 0.6rem" }}>
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      style={{ padding: "0.25rem 0.6rem" }}
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
