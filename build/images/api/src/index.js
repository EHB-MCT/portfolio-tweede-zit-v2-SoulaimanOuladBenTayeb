// Description: Main file for the forum API, setting up the server and database connection

const express = require("express");
const cors = require('cors');
const routes = require('./routes/forumRoutes');
const knex = require('knex');

const PORT = 3000;

// Initialize Knex
const pg = knex({
    client: 'pg',
    version: '16', 
    connection: process.env.PG_CONNECTION_STRING || 'postgres://admin:admin@localhost:5432/forumApi',
    port: 5432
});

const server = express();
server.use(cors()); 
server.use(express.json()); 

server.use('/', routes(pg)); // Pass Knex instance to routes

server.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
    initializeTables();
});

async function initializeTables() {
    try {
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
    } catch (error) {
        console.error(error);
    }
}

module.exports = server;
