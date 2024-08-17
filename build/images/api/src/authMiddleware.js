const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        console.error("Token not provided");
        return res.status(403).json({ error: 'You need to log in' });
    }

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Invalid token:", err.message);
            return res.status(403).json({ error: 'Invalid token' });
        }
    
        req.user = user; // This will include userId, name, and role
        next();
    });
    
}

module.exports = authenticateToken;
