const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2024WBHSql@',
    database: 'wbh_database',
    port: 3306 // ✅ Add MySQL default port
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL Database');
});

module.exports = db;
