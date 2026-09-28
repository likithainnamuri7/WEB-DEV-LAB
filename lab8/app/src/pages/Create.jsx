// src/pages/Create.jsx
// Handles both CREATE (no id param) and EDIT (with :id param)
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createPost, updatePost, fetchPost } from "../api.js";

export default function Create() {
  const { id }      = useParams();            // present when editing
  const navigate    = useNavigate();
  const isEditing   = Boolean(id);

  const [form,    setForm]    = useState({ title: "", content: "", author: "" });
  const [loading, setLoading] = useState(isEditing);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (!isEditing) return;
    fetchPost(id)
      .then((data) => setForm({ title: data.title, content: data.content, author: data.author }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEditing) {
        await updatePost(id, form);
        navigate(`/post/${id}`);
      } else {
        const created = await createPost(form);
        navigate(`/post/${created._id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <>
      <h1 className="page-title">{isEditing ? "Edit Post" : "Create New Post"}</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter post title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              id="author"
              name="author"
              type="text"
              placeholder="Your name (optional)"
              value={form.author}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              placeholder="Write your post content here…"
              value={form.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : isEditing ? "Update Post" : "Publish Post"}
            </button>
            <Link
              to={isEditing ? `/post/${id}` : "/"}
              className="btn btn-back"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
