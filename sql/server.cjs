const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const db = require('./db.cjs'); // MySQL Database connection
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

// ✅ CORS Configuration
const corsOptions = {
    origin: ['https://lumzum.github.io', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Session Configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// ✅ Ensure directories exist
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const RECYCLE_BIN = path.join(__dirname, 'recycle_bin');
fs.ensureDirSync(UPLOADS_DIR);
fs.ensureDirSync(RECYCLE_BIN);

// ✅ Authentication Middleware
function authenticateUser(req, res, next) {
    if (!req.session.username) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Please log in' });
    }
    next();
}

// ✅ Login API
app.post('/api/login', (req, res) => {
    const { company, username, password } = req.body;

    if (!company || !username || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const sql = 'SELECT * FROM users WHERE username = ? AND company = ?';
    db.query(sql, [username, company], (error, results) => {
        if (error) return res.status(500).json({ success: false, message: 'Database error' });
        if (results.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ success: false, message: 'Error comparing passwords' });
            if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password' });

            req.session.username = user.username;
            req.session.company = user.company;
            res.json({ success: true, message: 'Login successful', user: { username: user.username, role: user.role, company: user.company } });
        });
    });
});

// ✅ Logout API
app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// ✅ Secure Data Routes
app.get('/api/income', authenticateUser, (req, res) => {
    db.query('SELECT * FROM income WHERE company = ?', [req.session.company], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database query failed' });
        res.json(results);
    });
});

// ✅ Upload File API
app.post('/api/upload', authenticateUser, (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const file = req.files.file;
    const filePath = path.join(UPLOADS_DIR, file.name);
    file.mv(filePath, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'File upload failed' });
        res.json({ success: true, message: 'File uploaded successfully', filePath });
    });
});

// ✅ Delete File API
app.post('/api/delete-file', authenticateUser, (req, res) => {
    const { filename } = req.body;
    const filePath = path.join(UPLOADS_DIR, filename);
    const recyclePath = path.join(RECYCLE_BIN, filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found' });
    fs.move(filePath, recyclePath, (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Failed to delete file' });
        res.json({ success: true, message: 'File moved to recycle bin' });
    });
});

// ✅ Auto Delete Old Files in Recycle Bin
setInterval(() => {
    fs.readdir(RECYCLE_BIN, (err, files) => {
        if (err) return;
        files.forEach((file) => {
            const filePath = path.join(RECYCLE_BIN, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;
                const now = Date.now();
                const lastModified = new Date(stats.mtime).getTime();
                if ((now - lastModified) / (1000 * 60 * 60 * 24) > 30) {
                    fs.unlink(filePath, () => {});
                }
            });
        });
    });
}, 86400000);

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});