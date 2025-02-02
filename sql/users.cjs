const db = require('./db.cjs');
const bcrypt = require('bcrypt');
const { loginUser } = require('./auth.cjs');

// User details
const username = 'lumzum@winbornholding.com';
const plainPassword = '2024WBHLumzum@';
const role = 'admin';
const company = 'ALL ACCESS';

const saltRounds = 10;

// Hash the password before storing
bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
    if (err) {
        console.error('❌ Error hashing password:', err);
        return;
    }

    const sql = 'INSERT INTO users (username, password, role, company) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [username, hashedPassword, role, company], (error, results) => {
        if (error) {
            console.error('❌ Error inserting user:', error);
            return;
        }
        console.log('✅ User added successfully:', results);

        // After inserting the user, test login
        console.log('\n🔹 Testing Login:');
        loginUser(username, plainPassword); // ✅ Should log in successfully
        loginUser(username, 'wrongpassword'); // ❌ Should fail
    });
});
