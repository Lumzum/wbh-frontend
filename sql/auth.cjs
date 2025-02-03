const bcrypt = require('bcrypt');
const db = require('./db.cjs');

function loginUser(inputUsername, inputPassword, callback) {
    const sql = 'SELECT * FROM users WHERE username = ?';

    db.query(sql, [inputUsername], (error, results) => {
        if (error) {
            console.error('❌ Error fetching user:', error);
            callback(error, null);
            return;
        }

        if (results.length === 0) {
            callback(null, { success: false, message: 'User not found' });
            return;
        }

        const user = results[0];

        bcrypt.compare(inputPassword, user.password, (err, isMatch) => {
            if (err) {
                console.error('❌ Error comparing passwords:', err);
                callback(err, null);
                return;
            }

            if (isMatch) {
                callback(null, { success: true, user: { username: user.username, role: user.role, company: user.company } });
            } else {
                callback(null, { success: false, message: 'Incorrect password' });
            }
        });
    });
}

module.exports = { loginUser };
