const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');

function configureAuthRoutes(knex) {
    const router = express.Router();

    // Middleware to inject knex into the request
    router.use((req, res, next) => {
        req.knex = knex;
        next();
    });

    // Registration Route
    router.post('/register', async (req, res) => {
        console.log("Register route hit");
        const { name, lastname, email, password, role } = req.body;

        // Validate the required fields
        if (!name || !lastname || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate the role field
        if (!['teacher', 'student'].includes(role)) {
            return res.status(400).json({ error: "Invalid role selected" });
        }

        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            const [newUser] = await req.knex('users')
                .insert({
                    name,
                    lastname,
                    email,
                    password: hashedPassword,
                    role
                })
                .returning('*');

            // Respond with the newly created user
            res.status(201).json({ success: true, user: newUser });
        } catch (err) {
            console.error("Registration error:", err);
            res.status(500).json({ error: "Failed to register user" });
        }
    });

    // Login Route
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        try {
            const user = await req.knex('users').where({ email }).first();

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role, name: user.name }, // Include name in the token
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ success: true, token });
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ error: "Failed to login user" });
        }
    });

    
    return router;
}

module.exports = configureAuthRoutes;
