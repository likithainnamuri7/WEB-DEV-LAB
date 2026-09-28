// src/components/PostSummary.jsx
// A card component displayed on the Home and Archive pages
import { Link } from "react-router-dom";

export default function PostSummary({ post, onDelete }) {
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="post-card">
      <div className="post-card-header">
        <h2 className="post-card-title">
          <Link to={`/post/${post._id}`}>{post.title}</Link>
        </h2>
        <span className="post-card-meta">
          By <strong>{post.author}</strong> &bull; {date}
        </span>
      </div>

      <p className="post-card-excerpt">
        {post.content.length > 200
          ? post.content.slice(0, 200) + "…"
          : post.content}
      </p>

      <div className="post-card-actions">
        <Link to={`/post/${post._id}`} className="btn btn-secondary">
          Read More
        </Link>
        <Link to={`/post/${post._id}/edit`} className="btn btn-outline">
          Edit
        </Link>
        <button
          className="btn btn-danger"
          onClick={() => onDelete(post._id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
