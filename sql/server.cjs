const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const db = require('./db.cjs'); // MySQL Database connection
const bcrypt = require('bcrypt');

const app = express();

// ✅ CORS Configuration
const corsOptions = {
    origin: ['https://lumzum.github.io', 'http://localhost:3000'], // Add all allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(fileUpload()); // Enable file uploads

// ✅ Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Ensure 'uploads/' and 'recycle_bin/' directories exist
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const RECYCLE_BIN = path.join(__dirname, 'recycle_bin');
fs.ensureDirSync(UPLOADS_DIR);
fs.ensureDirSync(RECYCLE_BIN);

// ✅ Login API
app.post('/api/login', (req, res) => {
    const { company, username, password } = req.body;

    if (!company || !username || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

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

// ✅ Upload File API (Used for Quotations, Invoices, Payments)
app.post('/api/upload', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.files.file;
    const filePath = path.join(UPLOADS_DIR, file.name);

    file.mv(filePath, (err) => {
        if (err) {
            console.error('❌ File Upload Error:', err);
            return res.status(500).json({ success: false, message: 'File upload failed' });
        }

        res.json({ success: true, message: 'File uploaded successfully', filePath });
    });
});

// ✅ Delete File API (Moves file to recycle bin)
app.post('/api/delete-file', (req, res) => {
    const { filename } = req.body;
    const filePath = path.join(UPLOADS_DIR, filename);
    const recyclePath = path.join(RECYCLE_BIN, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }

    fs.move(filePath, recyclePath, (err) => {
        if (err) {
            console.error('❌ Error moving file to recycle bin:', err);
            return res.status(500).json({ success: false, message: 'Failed to delete file' });
        }

        res.json({ success: true, message: 'File moved to recycle bin' });
    });
});

// ✅ Restore File from Recycle Bin
app.post('/api/restore-file', (req, res) => {
    const { filename } = req.body;
    const recyclePath = path.join(RECYCLE_BIN, filename);
    const filePath = path.join(UPLOADS_DIR, filename);

    if (!fs.existsSync(recyclePath)) {
        return res.status(404).json({ success: false, message: 'File not found in recycle bin' });
    }

    fs.move(recyclePath, filePath, (err) => {
        if (err) {
            console.error('❌ Error restoring file:', err);
            return res.status(500).json({ success: false, message: 'Failed to restore file' });
        }

        res.json({ success: true, message: 'File restored successfully' });
    });
});

// ✅ Automatically delete files in Recycle Bin older than 30 days
setInterval(() => {
    fs.readdir(RECYCLE_BIN, (err, files) => {
        if (err) return console.error('❌ Error reading recycle bin:', err);

        files.forEach((file) => {
            const filePath = path.join(RECYCLE_BIN, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return console.error('❌ Error reading file stats:', err);

                const now = new Date().getTime();
                const lastModified = new Date(stats.mtime).getTime();
                const daysOld = (now - lastModified) / (1000 * 60 * 60 * 24);

                if (daysOld > 30) {
                    fs.unlink(filePath, (err) => {
                        if (err) console.error('❌ Error deleting old file:', err);
                        else console.log(`🗑️ Deleted old file: ${file}`);
                    });
                }
            });
        });
    });
}, 86400000); // Runs every 24 hours

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
