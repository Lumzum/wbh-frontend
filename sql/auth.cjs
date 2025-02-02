const bcrypt = require('bcrypt');
const db = require('./db.cjs'); // Import database connection

function loginUser(inputUsername, inputPassword) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    
    db.query(sql, [inputUsername], (error, results) => {
        if (error) {
            console.error('❌ Error fetching user:', error);
            return;
        }
        
        if (results.length === 0) {
            console.log('❌ User not found');
            return;
        }

        const user = results[0];

        // Compare entered password with hashed password
        bcrypt.compare(inputPassword, user.password, (err, isMatch) => {
            if (err) {
                console.error('❌ Error comparing passwords:', err);
                return;
            }

            if (isMatch) {
                console.log('✅ Login successful for:', user.username);
            } else {
                console.log('❌ Incorrect password');
            }
        });
    });
}

// Export function to use in other files
module.exports = { loginUser };
