const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '0.tcp.ap.ngrok.io',  // ✅ Update with the new Ngrok hostname
    user: 'root',
    password: '2024WBHSql@',
    database: 'wbh_database',
    port: 11376  // ✅ Update with the new Ngrok port
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL Database via Ngrok');
});

module.exports = db;
