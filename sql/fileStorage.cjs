const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadFolder = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const uploadFile = (req, res) => {
    res.json({ success: true, filePath: `/uploads/${req.file.filename}` });
};

const deleteFile = (req, res) => {
    const filePath = path.join(uploadFolder, req.body.filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ success: true, message: 'File deleted' });
    } else {
        res.status(400).json({ success: false, message: 'File not found' });
    }
};

module.exports = { upload, uploadFile, deleteFile };
