require('dotenv').config();
const express = require("express");
const cors = require('cors');
const configureRoutes = require('./routes/routes');
const knex = require('knex');
const retry = require('async-retry');
const path = require('path');

const PORT = process.env.PORT || 3000;

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
app.use(cors());
app.use(express.json());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the index.html file for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Configure and use API routes
app.use('/api', configureRoutes(pg));

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
    initializeTables();
});

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
        retries: 5,
        minTimeout: 1000
    });
}

// After all route definitions
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
