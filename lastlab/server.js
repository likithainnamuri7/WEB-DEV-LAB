/**
 * ============================================================================
 * STUDENT INFORMATION WEB SERVER
 * ============================================================================
 * Demonstrating the built-in Node.js core modules:
 *  1. 'http' - Creating the HTTP web server, routing requests, handling headers,
 *              status codes, and streaming request/response bodies.
 *  2. 'fs'   - Reading static files (HTML, CSS), persisting student data (JSON),
 *              and appending server access logs.
 *  3. 'url'  - Parsing request URLs, identifying pathnames, and extracting
 *              query string parameters for searching and filtering.
 * ============================================================================
 */

// Import Core Node.js Modules (No external dependencies required!)
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Server Configuration
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'students.json');
const LOG_FILE = path.join(__dirname, 'access.log');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Helper: Ensure the data file exists; initialize with empty array if missing
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
}

/**
 * Helper: Append request details to access.log using fs.appendFile
 * Demonstrates: fs module (asynchronous file append)
 */
function logRequest(req, statusCode) {
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.url} -> Status: ${statusCode}\n`;
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to access.log:', err);
    }
  });
}

/**
 * Helper: Read all students from students.json using fs.readFile
 * Demonstrates: fs module (asynchronous file read)
 */
function readStudents(callback) {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return callback(err, null);
    }
    try {
      const students = JSON.parse(data || '[]');
      callback(null, students);
    } catch (parseErr) {
      callback(parseErr, null);
    }
  });
}

/**
 * Helper: Save students array to students.json using fs.writeFile
 * Demonstrates: fs module (asynchronous file write)
 */
function writeStudents(students, callback) {
  fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), 'utf8', (err) => {
    callback(err);
  });
}

/**
 * Helper: Parse request body (supports both application/json and application/x-www-form-urlencoded)
 */
function parseRequestBody(req, callback) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      try {
        const parsed = JSON.parse(body || '{}');
        callback(null, parsed);
      } catch (err) {
        callback(err, null);
      }
    } else {
      // URL-encoded form data (e.g. from standard HTML <form>)
      const params = new URLSearchParams(body);
      const parsed = {};
      for (const [key, value] of params.entries()) {
        parsed[key] = value;
      }
      callback(null, parsed);
    }
  });
}

/**
 * Create HTTP Web Server
 * Demonstrates: http.createServer
 */
const server = http.createServer((req, res) => {
  // Demonstrates: url.parse(req.url, true) to parse pathname and query string parameters
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Intercept response finish to write request log
  res.on('finish', () => {
    logRequest(req, res.statusCode);
  });

  // Enable CORS headers for API accessibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // =========================================================================
  // ROUTE 1: Serve Web UI (index.html)
  // Demonstrates: http (GET), fs (readFile)
  // =========================================================================
  if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
    const filePath = path.join(PUBLIC_DIR, 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error: Could not read index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      }
    });
  }

  // =========================================================================
  // ROUTE 2: Serve Stylesheet (style.css)
  // Demonstrates: http (GET), fs (readFile)
  // =========================================================================
  else if (req.method === 'GET' && pathname === '/style.css') {
    const filePath = path.join(PUBLIC_DIR, 'style.css');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found: style.css not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
        res.end(content);
      }
    });
  }

  // =========================================================================
  // ROUTE 3: Get All Students / Filter by Query Parameters
  // Demonstrates: http (status & JSON header), fs (readFile), url (query params)
  // Examples:
  //   GET /api/students
  //   GET /api/students?department=Computer%20Science
  //   GET /api/students?search=Aarav
  // =========================================================================
  else if (req.method === 'GET' && (pathname === '/api/students' || pathname === '/students')) {
    readStudents((err, students) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read student data' }));
        return;
      }

      let filtered = students;

      // Demonstrates: url.query - Filter by department if query parameter is provided
      if (query.department) {
        filtered = filtered.filter(
          (s) => s.department && s.department.toLowerCase() === query.department.toLowerCase()
        );
      }

      // Demonstrates: url.query - Search across id, name, or department
      if (query.search) {
        const term = query.search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            (s.id && s.id.toLowerCase().includes(term)) ||
            (s.name && s.name.toLowerCase().includes(term)) ||
            (s.department && s.department.toLowerCase().includes(term))
        );
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(filtered, null, 2));
    });
  }

  // =========================================================================
  // ROUTE 4: Get Single Student by ID
  // Demonstrates: url.query.id, fs (readFile), http response
  // Example: GET /api/student?id=101
  // =========================================================================
  else if (req.method === 'GET' && pathname === '/api/student') {
    const studentId = query.id;
    if (!studentId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing required query parameter: id' }));
      return;
    }

    readStudents((err, students) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read student data' }));
        return;
      }

      const student = students.find((s) => String(s.id).toLowerCase() === String(studentId).toLowerCase());
      if (student) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(student, null, 2));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Student with ID '${studentId}' not found.` }));
      }
    });
  }

  // =========================================================================
  // ROUTE 5: Add Student Record (POST)
  // Demonstrates: http (POST, streaming req chunks), fs (readFile, writeFile)
  // Supports both application/json and HTML Form submissions
  // =========================================================================
  else if (req.method === 'POST' && (pathname === '/add-student' || pathname === '/api/students')) {
    parseRequestBody(req, (err, payload) => {
      if (err || !payload) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
        return;
      }

      const { id, name, email, department, semester, cgpa } = payload;

      // Simple validation
      if (!id || !name || !email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Fields id, name, and email are required.' }));
        return;
      }

      readStudents((readErr, students) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Error reading database file' }));
          return;
        }

        // Check if student with same ID already exists
        const exists = students.some((s) => String(s.id).toLowerCase() === String(id).toLowerCase());
        if (exists) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: `Student with ID '${id}' already exists.` }));
          return;
        }

        const newStudent = {
          id: String(id).trim(),
          name: String(name).trim(),
          email: String(email).trim(),
          department: department ? String(department).trim() : 'General',
          semester: semester ? Number(semester) : 1,
          cgpa: cgpa ? String(cgpa).trim() : '0.0'
        };

        students.push(newStudent);

        writeStudents(students, (writeErr) => {
          if (writeErr) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to write student record to disk' }));
            return;
          }

          const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
          const isAjax = req.headers['content-type'] && req.headers['content-type'].includes('application/json');

          if (acceptsHtml && !isAjax) {
            // Traditional HTML redirect / response
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
              <!DOCTYPE html>
              <html>
              <head><title>Success</title><link rel="stylesheet" href="/style.css"></head>
              <body style="padding: 40px; text-align: center;">
                <h2>Student Record Added Successfully!</h2>
                <p>Added: ${newStudent.name} (${newStudent.id})</p>
                <p><a href="/" class="btn" style="display:inline-block; width:auto; text-decoration:none;">Go Back to Home</a></p>
              </body>
              </html>
            `);
          } else {
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ message: 'Student added successfully', student: newStudent }));
          }
        });
      });
    });
  }

  // =========================================================================
  // ROUTE 6: Delete Student Record
  // Demonstrates: http (DELETE), url.query.id, fs (writeFile)
  // Supports DELETE /delete-student?id=101 or GET /delete-student?id=101
  // =========================================================================
  else if ((req.method === 'DELETE' || req.method === 'GET') && pathname === '/delete-student') {
    const studentId = query.id;
    if (!studentId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing required query parameter: id' }));
      return;
    }

    readStudents((err, students) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error reading database' }));
        return;
      }

      const initialLength = students.length;
      const updatedStudents = students.filter(
        (s) => String(s.id).toLowerCase() !== String(studentId).toLowerCase()
      );

      if (updatedStudents.length === initialLength) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Student with ID '${studentId}' not found.` }));
        return;
      }

      writeStudents(updatedStudents, (writeErr) => {
        if (writeErr) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to update database file' }));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ message: `Student '${studentId}' deleted successfully.` }));
      });
    });
  }

  // =========================================================================
  // ROUTE 7: View Server Access Logs
  // Demonstrates: fs.readFile, http (Content-Type: text/plain)
  // Example: GET /logs
  // =========================================================================
  else if (req.method === 'GET' && pathname === '/logs') {
    fs.readFile(LOG_FILE, 'utf8', (err, logData) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('No access logs recorded yet.');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(logData);
      }
    });
  }

  // =========================================================================
  // 404 Route: Not Found
  // Demonstrates: http response status 404
  // =========================================================================
  else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>404 Not Found</title><link rel="stylesheet" href="/style.css"></head>
      <body style="padding: 40px; text-align: center;">
        <h1>404 Not Found</h1>
        <p>The requested URL <code>${escapeHtml(req.url)}</code> was not found on this server.</p>
        <p><a href="/" class="btn" style="display:inline-block; width:auto; text-decoration:none;">Return to Portal</a></p>
      </body>
      </html>
    `);
  }
});

// Helper to escape HTML characters in 404 handler
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Start Server
server.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(` Student Information Web Server is actively running! `);
  console.log(` Address: http://localhost:${PORT}                      `);
  console.log(` Demonstrating: 'http', 'fs', and 'url' Node.js modules`);
  console.log(`======================================================`);
});
