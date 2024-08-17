require('dotenv').config();
const express = require("express");
const cors = require('cors');
const configureRoutes = require('./routes/routes');  // Existing routes
const configureAuthRoutes = require('./routes/authRoutes');  // New auth routes
const knex = require('knex');
const retry = require('async-retry');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Add error handling for unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
});

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
app.use('/auth', configureAuthRoutes(pg));  // Use the new auth routes

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
    initializeTables();
});

async function initializeTables() {
    await retry(async () => {
        const existsQuestions = await pg.schema.hasTable('questions');
        if (!existsQuestions) {
            await pg.schema.createTable('questions', table => {
                table.increments('id').primary();
                table.string('name').notNullable();
                table.string('role').notNullable();
                table.text('question').notNullable();
                table.string('questionDate').notNullable();
                table.integer('userId').notNullable();  // New column for userId
            });
            console.log('Table questions created');
        } else {
            console.log('Table questions already exists');
        }

        const existsAnswers = await pg.schema.hasTable('answers');
        if (!existsAnswers) {
            await pg.schema.createTable('answers', table => {
                table.increments('id').primary();
                table.integer('questionId').references('id').inTable('questions').onDelete('CASCADE');
                table.string('name').notNullable();
                table.string('role').notNullable();
                table.text('answer').notNullable();
                table.string('answerDate').notNullable();
                table.integer('userId').notNullable();
            });
            console.log('Table answers created');
        } else {
            console.log('Table answers already exists');
        }

        const usersTableExists = await pg.schema.hasTable('users');
        if (!usersTableExists) {
            await pg.schema.createTable('users', table => {
                table.increments('id').primary();
                table.string('name').notNullable();
                table.string('lastname').notNullable();
                table.string('email').notNullable().unique();
                table.string('password').notNullable();
                table.enum('role', ['teacher', 'student']).notNullable();
            });
            console.log('Table users created');
        } else {
            console.log('Table users already exists');
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
