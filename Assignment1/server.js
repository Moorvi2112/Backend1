const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Log file path
const logFilePath = path.join(__dirname, 'requests.log');
const MAX_LOG_SIZE = 1 * 1024 * 1024; // 1MB

// Middleware to log request details
const logRequestDetails = (req, res, next) => {
    rotateLogFile(); // Check for log rotation

    const logEntry = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.originalUrl,
        protocol: req.protocol,
        method: req.method,
        hostname: req.hostname,
        query: req.query, // Log query parameters
        headers: req.headers, // Log request headers
        userAgent: req.get('User -Agent'), // Log user-agent
    };

    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });

    next(); // Call the next middleware or route handler
};

// Function to rotate log file if it exceeds the maximum size
const rotateLogFile = () => {
    fs.stat(logFilePath, (err, stats) => {
        if (!err && stats.size >= MAX_LOG_SIZE) {
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const newLogFilePath = path.join(__dirname,`requests-${timestamp}.log`);
            fs.rename(logFilePath, newLogFilePath, (err) => {
                if (err) {
                    console.error('Error rotating log file', err);
                } else {
                    console.log(`Log file rotated to ${newLogFilePath}`);
                }
            });
        }
    });
};

// Use the logging middleware
app.use(logRequestDetails);

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});