const app = require('./index.js'); // Import the app from index.js

const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

app.listen(PORT, (err) => {
    if (err) {
        console.error(`Error starting server: ${err}`);
    } else {
        console.log(`Server running on port ${PORT}`);
    }
});
