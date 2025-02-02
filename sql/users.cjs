const db = require('./db.cjs');
const bcrypt = require('bcrypt');
const { loginUser } = require('./auth.cjs');

// User details
const username = 'lumzum@winbornholding.com';
const plainPassword = '2024WBHLumzum@';
const role = 'admin';
const company = 'ALL ACCESS';

const saltRounds = 10;

// Function to check if the user already exists
const checkUserExists = async (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], (error, results) => {
            if (error) {
                console.error('❌ Database error:', error);
                return reject(error);
            }
            resolve(results.length > 0);
        });
    });
};

// Function to insert a new user if they don't exist
const insertUser = async () => {
    try {
        const userExists = await checkUserExists(username);

        if (userExists) {
            console.log('⚠️ User already exists, skipping insert.');
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

            const sql = 'INSERT INTO users (username, password, role, company) VALUES (?, ?, ?, ?)';
            db.query(sql, [username, hashedPassword, role, company], (error, results) => {
                if (error) {
                    console.error('❌ Error inserting user:', error);
                    return;
                }
                console.log('✅ User added successfully:', results);

                // After inserting, test login
                console.log('\n🔹 Testing Login:');
                loginUser(username, plainPassword); // ✅ Should log in successfully
                loginUser(username, 'wrongpassword'); // ❌ Should fail
            });
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

// Execute the function
insertUser();

module.exports = { insertUser };
