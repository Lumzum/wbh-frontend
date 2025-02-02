const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./db.cjs'); // MySQL Database connection
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Login API Route
app.post('/api/login', (req, res) => {
    const { company, username, password } = req.body;

    // Check if all fields are filled
    if (!company || !username || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Query the database
    const sql = 'SELECT * FROM users WHERE username = ? AND company = ?';
    db.query(sql, [username, company], (error, results) => {
        if (error) {
            console.error("❌ Database error:", error);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'User not found or incorrect company' });
        }

        const user = results[0];

        // Compare entered password with stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Incorrect password' });
            }

            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    username: user.username,
                    role: user.role,
                    company: user.company,
                },
            });
        });
    });
});

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
