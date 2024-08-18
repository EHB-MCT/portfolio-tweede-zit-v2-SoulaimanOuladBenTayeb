const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');

function configureAuthRoutes(knex) {
    const router = express.Router();

    // Middleware to inject knex into the request object
    router.use((req, res, next) => {
        req.knex = knex;
        next();
    });

    // Registration Route: Handles user registration
    router.post('/register', async (req, res) => {
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
            // Hash the user's password before storing it
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the 'users' table
            const [newUser] = await req.knex('users')
                .insert({
                    name,
                    lastname,
                    email,
                    password: hashedPassword,
                    role
                })
                .returning('*'); // Return the inserted user

            // Respond with the newly created user
            res.status(201).json({ success: true, user: newUser });
        } catch (err) {
            console.error("Registration error:", err);
            res.status(500).json({ error: "Failed to register user" });
        }
    });

    // Login Route: Handles user login
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        // Validate the required fields
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        try {
            // Fetch the user from the database using the provided email
            const user = await req.knex('users').where({ email }).first();

            // Check if user exists and if the password is correct
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            // Generate a JWT token for the user
            const token = jwt.sign(
                { userId: user.id, role: user.role, name: user.name }, // Include user information in the token
                process.env.JWT_SECRET,
                { expiresIn: '1h' } // Token expires in 1 hour
            );

            // Respond with the generated token
            res.json({ success: true, token });
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ error: "Failed to login user" });
        }
    });

    return router;
}

module.exports = configureAuthRoutes;
