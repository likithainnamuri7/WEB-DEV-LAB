# Student Information Web Server (Node.js)

A lightweight, zero-dependency Student Information Web Server built exclusively using Node.js built-in core modules:
- **`http`**: Web server creation, routing, request/response streaming, HTTP methods, headers, and status codes.
- **`fs`**: File system operations including reading static assets (`index.html`, `style.css`), reading/writing JSON records (`students.json`), and appending audit logs (`access.log`).
- **`url`**: URL string parsing, pathname routing, and query parameter extraction for searching and filtering.

---

## 📂 Project Structure

```text
lastlab/
├── server.js            # Main HTTP server with routing & business logic
├── students.json        # Persistent JSON data storage (read & written via 'fs')
├── access.log           # Request audit trail (appended via 'fs.appendFile')
├── package.json         # Project metadata and run scripts
├── test-server.js       # Automated end-to-end endpoint tests
├── run-verification.js  # Test runner that boots server, tests, and exits
└── public/
    ├── index.html       # Responsive web dashboard interface
    └── style.css        # Clean UI stylesheet
```

---

## 🛠️ How Each Core Module is Demonstrated

### 1. `http` Module (`const http = require('http')`)
- **`http.createServer((req, res) => { ... })`**: Initializes the HTTP web server.
- **`req.method`**: Handles `GET`, `POST`, `DELETE`, and `OPTIONS` (preflight) requests.
- **`req.on('data')` & `req.on('end')`**: Reads incoming data stream for payload parsing.
- **`res.writeHead(status, headers)`**: Sends HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `409 Conflict`, `500 Internal Error`) and `Content-Type` headers (`text/html`, `application/json`, `text/css`, `text/plain`).
- **`server.listen(PORT)`**: Binds the server to port `3000`.

### 2. `fs` Module (`const fs = require('fs')`)
- **`fs.readFile(path, 'utf8', callback)`**:
  - Delivers static HTML (`public/index.html`) and CSS (`public/style.css`).
  - Reads student records from `students.json`.
  - Reads the audit log file at `/logs`.
- **`fs.writeFile(path, data, callback)`**:
  - Persists newly added student records to `students.json`.
  - Updates the file when a student record is deleted.
- **`fs.appendFile(path, data, callback)`**:
  - Logs each incoming HTTP request (`timestamp`, `method`, `URL`, `status`) to `access.log`.
- **`fs.existsSync(path)` & `fs.writeFileSync(path, ...)`**:
  - Automatically initializes `students.json` if it does not yet exist.

### 3. `url` Module (`const url = require('url')`)
- **`url.parse(req.url, true)`**:
  - Parses the raw URL string into an object containing `pathname` and `query`.
  - **`parsedUrl.pathname`**: Route dispatching (`/`, `/api/students`, `/api/student`, `/add-student`, `/delete-student`, `/logs`).
  - **`parsedUrl.query`**: Extracts query string parameters:
    - `GET /api/students?department=Computer%20Science` (Filter by department)
    - `GET /api/students?search=Aarav` (Search by keyword)
    - `GET /api/student?id=101` (Direct lookup by ID)
    - `DELETE /delete-student?id=101` (Deletion target ID)

---

## 🚀 How to Run

### Step 1: Start the Server
In your terminal, navigate to the project directory and run:
```bash
node server.js
```
*(Or run `npm start`)*

You will see:
```text
======================================================
 Student Information Web Server is actively running! 
 Address: http://localhost:3000                      
 Demonstrating: 'http', 'fs', and 'url' Node.js modules
======================================================
```

### Step 2: Open in Browser
Visit **[http://localhost:3000](http://localhost:3000)** to view the web dashboard:
- Add new student records using the form.
- Search and filter records in real-time.
- Delete student records.
- Click demo links to inspect JSON responses and access logs.

---

## 🧪 Automated Testing

To run the automated verification suite:
```bash
npm test
```
This boots the server, verifies all 9 core capabilities (`http`, `fs`, `url`), and displays pass/fail assertions.

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description | Modules Used |
|---|---|---|---|
| `GET` | `/` | Web Dashboard | `http`, `fs` |
| `GET` | `/style.css` | Stylesheet | `http`, `fs` |
| `GET` | `/api/students` | List all students in JSON | `http`, `fs` |
| `GET` | `/api/students?department=CSE` | Filter by department | `http`, `fs`, `url` |
| `GET` | `/api/students?search=diya` | Search by query keyword | `http`, `fs`, `url` |
| `GET` | `/api/student?id=101` | Get single student by ID | `http`, `fs`, `url` |
| `POST` | `/add-student` | Add student (JSON or Form) | `http`, `fs` |
| `DELETE` | `/delete-student?id=101` | Delete student by ID | `http`, `fs`, `url` |
| `GET` | `/logs` | View server audit log | `http`, `fs` |
