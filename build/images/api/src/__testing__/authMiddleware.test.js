const { authenticateToken } = require('../authMiddleware');

describe('Auth Middleware', () => {
    // Test case to check if a 403 error is returned when no token is provided
    it('should return 403 if no token is provided', () => {
        const req = {
            headers: {}  // Simulate a request with no authorization header
        };
        const res = {
            status: jest.fn().mockReturnThis(),  // Mock status method to return the response object
            json: jest.fn()  // Mock json method to capture the response data
        };
        const next = jest.fn();  // Mock the next middleware function

        authenticateToken(req, res, next);  // Call the middleware function

        expect(res.status).toHaveBeenCalledWith(403);  // Expect a 403 status code
        expect(res.json).toHaveBeenCalledWith({ error: 'You need to log in' });  // Expect an error message
    });

    // Test case to check if the next middleware is called when a valid token is provided
    it('should call next if token is valid', () => {
        const token = 'valid-token';  // Simulate a valid token
        const req = {
            headers: { authorization: `Bearer ${token}` }  // Simulate a request with a valid authorization header
        };
        const res = {};
        const next = jest.fn();  // Mock the next middleware function

        authenticateToken(req, res, next);  // Call the middleware function

        expect(next).toHaveBeenCalled();  // Expect the next middleware function to be called
    });
});
