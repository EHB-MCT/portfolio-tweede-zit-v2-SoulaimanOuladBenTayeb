const request = require('supertest');
const app = require('../index'); // Import the Express app

describe('API Routes', () => {

    // Test case for fetching all questions
    it('should fetch all questions', async () => {
        const res = await request(app)
            .get('/api/questions')  // Send GET request to fetch all questions
            .send();  // No data to send in the body for a GET request

        // Assertions to check if the response is as expected
        expect(res.statusCode).toEqual(200);  // Expect a 200 OK status code
        expect(Array.isArray(res.body)).toBeTruthy();  // Expect the response body to be an array
    });

    // Test case for adding a new question with authentication
    it('should add a new question (authenticated)', async () => {
        const token = 'valid-token';  // Replace with a valid token for testing
        const newQuestion = {
            question: 'What is the meaning of life?',
            questionDate: new Date().toISOString()
        };

        const res = await request(app)
            .post('/api/questions')  // Send POST request to add a new question
            .set('Authorization', `Bearer ${token}`)  // Set the Authorization header with the token
            .send(newQuestion);  // Send the newQuestion data in the request body

        // Assertions to check if the response is as expected
        expect(res.statusCode).toEqual(201);  // Expect a 201 Created status code
        expect(res.body).toHaveProperty('success', true);  // Expect the success property to be true
        expect(res.body.question).toHaveProperty('id');  // Expect the question object to have an id property
    });

});
