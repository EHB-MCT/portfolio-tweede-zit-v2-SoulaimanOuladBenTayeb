require('dotenv').config(); // Ensure environment variables are loaded

const express = require("express");
const cors = require('cors');
const routes = require('./routes/routes');
const knex = require('knex');

const PORT = process.env.PORT || 3000; // Default to 3000 if not specified

// Initialize Knex
const pg = knex({
    client: 'pg',
    version: '16',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME 
    }
});

const server = express();
server.use(cors());
server.use(express.json());

server.use('/', routes(pg)); // Pass Knex instance to routes

server.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
    initializeTables();
});

const retry = require('async-retry');

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
        retries: 5, // Retry 5 times
        minTimeout: 1000 // Wait 1 second between retries
    });
}


module.exports = server;
