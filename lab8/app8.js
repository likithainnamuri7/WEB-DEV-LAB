const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3008;

// Middleware to log incoming requests
function logger8(req, res, next) {
    console.log(
        `${new Date().toLocaleString()} - ${req.method} ${req.url}`
    );

    next();
}

// Handle requests
function handleRequest8(req, res) {

    let filePath;

    // Home page
    if (req.url === '/' || req.url === '/home8.html') {
        filePath = path.join(__dirname, 'pages', 'home8.html');
    }

    // About page
    else if (req.url === '/about8' || req.url === '/about8.html') {
        filePath = path.join(__dirname, 'pages', 'about8.html');
    }

    // CSS file
    else if (req.url === '/style8.css') {
        filePath = path.join(__dirname, 'assets', 'style8.css');
    }

    // Invalid route
    else {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        });

        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>404 - Page Not Found</title>
            </head>
            <body>
                <h1>404 - Page Not Found</h1>
                <p>The requested page does not exist.</p>
                <a href="/">Go to Home</a>
            </body>
            </html>
        `);

        return;
    }

    // Read the requested file
    fs.readFile(filePath, (err, data) => {

        if (err) {
            console.error('File Error:', err.message);

            res.writeHead(404, {
                'Content-Type': 'text/html'
            });

            res.end(`
                <h1>404 - File Not Found</h1>
                <p>The requested file could not be found.</p>
            `);

            return;
        }

        // Determine content type
        const extension = path.extname(filePath);

        let contentType = 'text/plain';

        if (extension === '.html') {
            contentType = 'text/html';
        }
        else if (extension === '.css') {
            contentType = 'text/css';
        }

        // Send response
        res.writeHead(200, {
            'Content-Type': contentType
        });

        res.end(data);
    });
}

// Create HTTP server
const server8 = http.createServer((req, res) => {

    // Run logging middleware
    logger8(req, res, () => {

        // Handle request
        handleRequest8(req, res);

    });

});

// Handle server errors
server8.on('error', (error) => {
    console.error('Server Error:', error.message);
});

// Start server
server8.listen(PORT, () => {
    console.log(`Lab 8 server running at http://localhost:${PORT}`);
});