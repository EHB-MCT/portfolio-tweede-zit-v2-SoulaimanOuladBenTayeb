const express = require('express');

function configureRoutes(knex) {
    const router = express.Router();

    router.use((req, res, next) => {
        req.knex = knex;
        next();
    });

    router.get('/', (req, res) => {
        res.redirect('/index.html');
    });

    router.get('/questions', async (req, res) => {
        try {
            const questions = await req.knex.select().from('questions');
            res.json(questions);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    router.post('/questions', async (req, res) => {
        const { studentName, question, questionDate } = req.body;
    
        if (studentName && question && questionDate) {
            try {
                const [newQuestion] = await req.knex('questions').insert({
                    studentName,
                    question,
                    questionDate
                }).returning('*');
                res.json(newQuestion);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            }
        } else {
            res.status(400).json("Invalid input data");
        }
    });

    // PUT request: Update a question by ID
    router.put('/questions/:id', async (req, res) => {
        const { id } = req.params;
        const { answer, answerDate, teacherName } = req.body;

        if (answer && answerDate && teacherName) {
            try {
                const [updatedQuestion] = await req.knex('questions')
                    .where('id', id)
                    .update({
                        answer: answer,
                        answerDate: answerDate,
                        teacherName: teacherName
                    }).returning('*');
                res.json(updatedQuestion);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            }
        } else {
            res.status(400).json("Invalid input data");
        }
    });

    // DELETE request: Delete a question by ID
    router.delete('/questions/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const [deletedQuestion] = await req.knex('questions')
                .where('id', id)
                .del()
                .returning('*');
            res.json(deletedQuestion);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

    return router;
}

module.exports = configureRoutes;
