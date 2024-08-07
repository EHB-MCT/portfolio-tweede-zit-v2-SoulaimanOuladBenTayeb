// Description: Routes for the forum API

const express = require('express');
const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    res.redirect('/index.html'); 
});

/**
 * @api {get} /questions Get all questions
 * @returns {Array} List of questions
 */
router.get("/questions", async (req, res) => {
    try {
        const questions = await req.knex.select().from("questions");
        res.json(questions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @api {get} /questions/:id Get a question by ID
 * @returns {Object} Question object
 */
router.get("/questions/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const question = await req.knex.select().from("questions").where({ id });
        res.json(question);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @api {post} /questions Add a new question
 * @param {String} studentName Name of the student
 * @param {String} question Question text
 * @param {String} questionDate Date of the question
 * @returns {Object} Added question
 */
router.post("/questions", async (req, res) => {
    const { studentName, question, questionDate } = req.body;

    if (studentName && question && questionDate) {
        try {
            const [newQuestion] = await req.knex("questions").insert({
                studentName,
                question,
                questionDate
            }).returning('*');
            res.json(newQuestion);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(400).json("Invalid input data");
    }
});

/**
 * @api {put} /questions/:id Update a question with an answer
 * @param {String} id ID of the question
 * @param {String} answer Answer text
 * @param {String} answerDate Date of the answer
 * @param {String} teacherName Name of the teacher answering
 * @returns {Object} Updated question
 */
router.put("/questions/:id", async (req, res) => {
    const { id } = req.params;
    const { answer, answerDate, teacherName } = req.body;

    if (answer && answerDate && teacherName) {
        try {
            const [updatedQuestion] = await req.knex("questions").where("id", id).update({
                answer,
                answerDate,
                teacherName
            }).returning('*');
            res.json(updatedQuestion);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(400).json("Invalid input data");
    }
});

/**
 * @api {delete} /questions/:id Delete a question
 * @param {String} id ID of the question
 * @returns {Object} Deleted question
 */
router.delete("/questions/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: "Missing id parameter" });
    } else {
        try {
            const [deletedQuestion] = await req.knex("questions").where("id", id).del().returning('*');
            res.json(deletedQuestion);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    }
});

module.exports = (knex) => {
    router.use((req, res, next) => {
        req.knex = knex; // Attach knex instance to request
        next();
    });
    return router;
};
