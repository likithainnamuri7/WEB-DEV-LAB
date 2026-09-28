# Blog / Post Management App

A full-stack CRUD application built with **React**, **Express.js**, and **MongoDB Atlas**.

---

## Project Structure

```
lab8/
├── app/                         ← Vite + React frontend
│   ├── src/
│   │   ├── App.jsx              ← Root component + React Router routes
│   │   ├── main.jsx             ← React entry point
│   │   ├── index.css            ← Global styles
│   │   ├── api.js               ← Centralised fetch() helpers
│   │   ├── components/
│   │   │   └── PostSummary.jsx  ← Reusable post card
│   │   └── pages/
│   │       ├── Home.jsx         ← All posts (card view)
│   │       ├── Create.jsx       ← Create & Edit form (shared)
│   │       ├── Post.jsx         ← Single post detail
│   │       └── Archive.jsx      ← All posts (table view)
│   └── vite.config.js           ← Dev proxy → Express on :5050
│
└── server/                      ← Node.js + Express REST API
    ├── index.mjs                ← Entry point, middleware, starts server
    ├── loadEnvironment.mjs      ← Loads .env via dotenv
    ├── .env                     ← Connection string (fill in your values!)
    ├── db/
    │   └── conn.mjs             ← MongoDB singleton client
    └── routes/
        └── posts.mjs            ← CRUD router for /posts
```

---

## Prerequisites

- Node.js ≥ 18
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier works)

---

## Setup

### 1 – Configure MongoDB Atlas

Edit `server/.env` and replace the placeholder values:

```env
ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=blogdb
PORT=5050
```

### 2 – Start the Backend

```bash
cd server
npm install        # already done if you followed setup
npm run dev        # uses node --watch for auto-reload
```

Server starts at **http://localhost:5050**

### 3 – Start the Frontend

Open a second terminal:

```bash
cd app
npm install        # already done
npm run dev        # Vite dev server
```

Frontend starts at **http://localhost:5173**

---

## REST API Reference

| Method | Endpoint       | Description            |
|--------|----------------|------------------------|
| GET    | `/posts`       | Return all posts       |
| GET    | `/posts/:id`   | Return one post        |
| POST   | `/posts`       | Create a new post      |
| PUT    | `/posts/:id`   | Update an existing post|
| DELETE | `/posts/:id`   | Delete a post          |

### POST / PUT body (JSON)

```json
{
  "title":   "My First Post",
  "content": "Hello, world!",
  "author":  "Jane Doe"
}
```

---

## Frontend Routes

| Path              | Page    | Description              |
|-------------------|---------|--------------------------|
| `/`               | Home    | Card view of all posts   |
| `/create`         | Create  | New post form            |
| `/post/:id`       | Post    | Full post detail          |
| `/post/:id/edit`  | Edit    | Pre-filled edit form     |
| `/archive`        | Archive | Table view of all posts  |

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, React Router v7, Vite 8   |
| API calls | Browser `fetch()` (no Axios/libs)   |
| Backend   | Node.js, Express 4                  |
| Database  | MongoDB Atlas (official Node driver)|
| Config    | `dotenv` via `.env`                 |
