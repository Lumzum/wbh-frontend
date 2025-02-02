const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db.cjs');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
    const { company, username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ? AND company = ?';
    db.query(sql, [username, company], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const user = results[0];

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

app.listen(3000, () => {
    console.log('✅ Server running on port 3000');
});
