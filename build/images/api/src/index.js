require('dotenv').config();
const express = require("express");
const cors = require('cors');
<<<<<<< Updated upstream
const configureRoutes = require('./routes/routes');
=======
const configureRoutes = require('./routes/routes');  // Importing API routes
const configureAuthRoutes = require('./routes/authRoutes');  // Importing authentication routes
>>>>>>> Stashed changes
const knex = require('knex');
const retry = require('async-retry');
const path = require('path');

const PORT = process.env.PORT || 3000;

<<<<<<< Updated upstream
=======
// Global error handling for unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
});

// Initialize knex with PostgreSQL configuration
>>>>>>> Stashed changes
const pg = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME 
    }
});

const app = express();
app.use(cors());  // Enable Cross-Origin Resource Sharing
app.use(express.json());  // Enable JSON body parsing for incoming requests

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the index.html file for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

<<<<<<< Updated upstream
// Configure and use API routes
app.use('/api', configureRoutes(pg));
=======
// Configure and use API routes and authentication routes
app.use('/api', configureRoutes(pg));  // API routes
app.use('/auth', configureAuthRoutes(pg));  // Authentication routes
>>>>>>> Stashed changes

// Start the server and initialize the database tables
app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
    initializeTables();
});

/**
 * Function to initialize database tables if they don't already exist.
 * Uses async-retry to attempt the initialization multiple times in case of failure.
 */
async function initializeTables() {
    await retry(async () => {
        const exists = await pg.schema.hasTable('questions');
        if (!exists) {
            await pg.schema.createTable('questions', table => {
                table.increments('id').primary();
                table.string('studentName');
                table.text('question');
                table.string('questionDate');
                table.text('answer').nullable();
                table.string('answerDate').nullable();
                table.string('teacherName').nullable();
            });
            console.log('Table questions created');
        } else {
            console.log('Table questions already exists');
        }
    }, {
        retries: 5,  // Number of retry attempts
        minTimeout: 1000  // Minimum timeout between retries (in milliseconds)
    });
}

<<<<<<< Updated upstream
// After all route definitions
=======
// Error handling middleware for catching all errors
>>>>>>> Stashed changes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
