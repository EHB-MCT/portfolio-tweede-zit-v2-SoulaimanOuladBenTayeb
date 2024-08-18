const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate the JWT token from the request header.
 * 
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function in the stack.
 * 
 * This middleware checks for the presence of a JWT token in the Authorization header.
 * If the token is present and valid, it decodes the token and attaches the user
 * information (userId, name, role) to the request object, allowing subsequent
 * middleware or route handlers to access it. If the token is missing or invalid,
 * it responds with a 403 status code and an appropriate error message.
 */
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    // Check if the token is provided in the Authorization header
    if (!token) {
        console.error("Token not provided");
        return res.status(403).json({ error: 'You need to log in' });
    }

    // Verify the provided token using the JWT secret
    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Invalid token:", err.message);
            return res.status(403).json({ error: 'Invalid token' });
        }
    
        // Attach the decoded user information to the request object
        req.user = user; 
        next(); // Proceed to the next middleware or route handler
    });
}

module.exports = authenticateToken;
