const express = require('express');
const authenticateToken = require('../authMiddleware');

function configureRoutes(knex) {
    const router = express.Router();


    // Middleware to inject knex into the request object
    router.use((req, res, next) => {
        req.knex = knex;
        next();
    });

    // GET all questions
    router.get('/', (req, res) => {
        res.redirect('/index.html');
    });

    router.get('/questions', async (req, res) => {
        try {
            const questions = await req.knex('questions').select();
            res.json(questions);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to retrieve questions" });
        }
    });

    // POST a new question (protected route)
    router.post('/questions', async (req, res) => {
        const { studentName, question, questionDate } = req.body;
    
        if (studentName && question && questionDate) {
            try {
                const [newQuestion] = await req.knex('questions').insert({
                    studentName,
                    question,
                    questionDate,
                    userId  // Associate the question with the user who created it
                })
                .returning('*');
    
            res.status(201).json({ success: true, question: newQuestion });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to post question" });
        }
    });

    // PUT to edit a question (protected route)
    router.put('/questions/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const { question } = req.body;
        const userId = req.user.userId;

        try {
            // Check if the question exists and belongs to the logged-in user
            const existingQuestion = await req.knex('questions').where({ id }).first();
            if (existingQuestion.userId !== userId) {
                return res.status(403).json({ error: "You can only edit your own questions" });
            }

            const updated = await req.knex('questions')
                .where({ id })
                .update({ question });

            if (updated) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: "Question not found" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to edit question" });
        }
    });

    // DELETE a question (protected route)
    router.delete('/questions/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;

        try {
            // Check if the question exists and belongs to the logged-in user
            const existingQuestion = await req.knex('questions').where({ id }).first();
            if (existingQuestion.userId !== userId) {
                return res.status(403).json({ error: "You can only delete your own questions" });
            }

            const deleted = await req.knex('questions').where({ id }).del();

            if (deleted) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: "Question not found" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to delete question" });
        }
    });

    // GET all answers for a specific question
    router.get('/questions/:id/answers', async (req, res) => {
        const { id } = req.params;
        try {
            const answers = await req.knex('answers').where({ questionId: id });
            res.json(answers);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to retrieve answers" });
        }
    });

    // POST a new answer (protected route)
    router.post('/questions/:id/answers', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const { answer, answerDate } = req.body;
        const name = req.user.name;
        const role = req.user.role;
        const userId = req.user.userId;
    
        try {
            // Insert the new answer into the 'answers' table
            const [newAnswer] = await req.knex('answers')
                .insert({
                    questionId: id,
                    name,
                    role,
                    answer,
                    answerDate,
                    userId
                })
            const [deletedQuestion] = await req.knex('questions')
                .where('id', id)
                .del()
    // POST a new question (protected route)
    router.post('/questions', authenticateToken, async (req, res) => {
        const { question, questionDate } = req.body;
        const name = req.user.name;
        const role = req.user.role;
        const userId = req.user.userId;  // Get the userId from the token
        
        try {
            // Insert the new question into the 'questions' table
            const [newQuestion] = await req.knex('questions')
                .insert({
                    name,
                    role,
                    question,
                    questionDate,
                    userId  // Associate the question with the user who created it
                })
                .returning('*');
    
            res.status(201).json({ success: true, answer: newAnswer });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to post answer" });
        }
    });

    // DELETE an answer (protected route)
    router.delete('/answers/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;

        try {
            // Check if the answer exists and belongs to the logged-in user
            const existingAnswer = await req.knex('answers').where({ id }).first();
            if (!existingAnswer) {
                return res.status(404).json({ error: "Answer not found" });
            }
            if (existingAnswer.userId !== userId) {
                return res.status(403).json({ error: "You can only delete your own answers" });
            }

            const deleted = await req.knex('answers').where({ id }).del();

            if (deleted) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: "Answer not found" });
            }
        } catch (err) {
            console.error('Error deleting answer:', err);
            res.status(500).json({ error: "Failed to delete answer" });
        }
    });

    // PUT to edit an answer (protected route)
    router.put('/answers/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const { answer } = req.body;
        const userId = req.user.userId;

        try {
            // Check if the answer exists and belongs to the logged-in user
            const existingAnswer = await req.knex('answers').where({ id }).first();
            if (!existingAnswer) {
                return res.status(404).json({ error: "Answer not found" });
            }
            if (existingAnswer.userId !== userId) {
                return res.status(403).json({ error: "You can only edit your own answers" });
            }

            const updated = await req.knex('answers')
                .where({ id })
                .update({ answer });

            if (updated) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: "Answer not found" });
            }
        } catch (err) {
            console.error('Error editing answer:', err);
            res.status(500).json({ error: "Failed to edit answer" });
        }
    });

    // PUT to edit a question (protected route)
    router.put('/questions/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const { question } = req.body;
        const userId = req.user.userId;

        try {
            // Check if the question exists and belongs to the logged-in user
            const existingQuestion = await req.knex('questions').where({ id }).first();
            if (existingQuestion.userId !== userId) {
                return res.status(403).json({ error: "You can only edit your own questions" });
            }

            const updated = await req.knex('questions')
                .where({ id })
                .update({ question });

            if (updated) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: "Question not found" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to edit question" });
        }
    });

    // DELETE a question (protected route)
    router.delete('/questions/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;

        try {
            // Check if the question exists and belongs to the logged-in user
            const existingQuestion = await req.knex('questions').where({ id }).first();
            if (existingQuestion.userId !== userId) {
                return res.status(403).json({ error: "You can only delete your own questions" });
            }

            const deleted = await req.knex('questions').where({ id }).del();

            if (deleted) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: "Question not found" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to delete question" });
        }
    });

    // GET all answers for a specific question
    router.get('/questions/:id/answers', async (req, res) => {
        const { id } = req.params;
        try {
            const answers = await req.knex('answers').where({ questionId: id });
            res.json(answers);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to retrieve answers" });
        }
    });

    // POST a new answer (protected route)
    router.post('/questions/:id/answers', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const { answer, answerDate } = req.body;
        const name = req.user.name;
        const role = req.user.role;
        const userId = req.user.userId;
    
        try {
            // Insert the new answer into the 'answers' table
            const [newAnswer] = await req.knex('answers')
                .insert({
                    questionId: id,
                    name,
                    role,
                    answer,
                    answerDate,
                    userId
                })
                .returning('*');
    
            res.status(201).json({ success: true, answer: newAnswer });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to post answer" });
        }
    });

    // DELETE an answer (protected route)
    router.delete('/answers/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const userId = req.user.userId;

        try {
            // Check if the answer exists and belongs to the logged-in user
            const existingAnswer = await req.knex('answers').where({ id }).first();
            if (!existingAnswer) {
                return res.status(404).json({ error: "Answer not found" });
            }
            if (existingAnswer.userId !== userId) {
                return res.status(403).json({ error: "You can only delete your own answers" });
            }

            const deleted = await req.knex('answers').where({ id }).del();

            if (deleted) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: "Answer not found" });
            }
        } catch (err) {
            console.error('Error deleting answer:', err);
            res.status(500).json({ error: "Failed to delete answer" });
        }
    });

    // PUT to edit an answer (protected route)
    router.put('/answers/:id', authenticateToken, async (req, res) => {
        const { id } = req.params;
        const { answer } = req.body;
        const userId = req.user.userId;

        try {
            // Check if the answer exists and belongs to the logged-in user
            const existingAnswer = await req.knex('answers').where({ id }).first();
            if (!existingAnswer) {
                return res.status(404).json({ error: "Answer not found" });
            }
            if (existingAnswer.userId !== userId) {
                return res.status(403).json({ error: "You can only edit your own answers" });
            }

            const updated = await req.knex('answers')
                .where({ id })
                .update({ answer });

            if (updated) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: "Answer not found" });
            }
        } catch (err) {
            console.error('Error editing answer:', err);
            res.status(500).json({ error: "Failed to edit answer" });
        }
    });
    return router;
}

module.exports = configureRoutes;
