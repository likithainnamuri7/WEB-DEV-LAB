// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home    from "./pages/Home.jsx";
import Create  from "./pages/Create.jsx";
import Post    from "./pages/Post.jsx";
import Archive from "./pages/Archive.jsx";
import "./index.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">✍️ BlogApp</Link>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/create">New Post</Link></li>
          <li><Link to="/archive">Archive</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/create"         element={<Create />} />
          <Route path="/post/:id"       element={<Post />} />
          <Route path="/post/:id/edit"  element={<Create />} />
          <Route path="/archive"        element={<Archive />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
