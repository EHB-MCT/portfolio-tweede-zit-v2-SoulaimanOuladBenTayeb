const request = require('supertest');
const app = require('../index'); // Import the Express app

describe('Auth Routes', () => {

    // Test case for registering a new user
    it('should register a new user', async () => {
        const newUser = {
            name: 'Test',
            lastname: 'User',
            email: 'testuser@example.com',
            password: 'password123',
            role: 'student'
        };

        const res = await request(app)
            .post('/auth/register')  // Send POST request to register endpoint
            .send(newUser);  // Send the newUser data in the request body

        // Assertions to check if the response is as expected
        expect(res.statusCode).toEqual(201);  // Expect a 201 Created status code
        expect(res.body).toHaveProperty('success', true);  // Expect the success property to be true
        expect(res.body.user).toHaveProperty('id');  // Expect the user object to have an id property
        expect(res.body.user).toHaveProperty('email', newUser.email);  // Expect the user object to have the correct email
    });

    // Test case for logging in an existing user
    it('should login an existing user', async () => {
        const user = {
            email: 'testuser@example.com',
            password: 'password123'
        };

        const res = await request(app)
            .post('/auth/login')  // Send POST request to login endpoint
            .send(user);  // Send the user data in the request body

        // Assertions to check if the response is as expected
        expect(res.statusCode).toEqual(200);  // Expect a 200 OK status code
        expect(res.body).toHaveProperty('success', true);  // Expect the success property to be true
        expect(res.body).toHaveProperty('token');  // Expect the response to include a token
    });

});
