const db = require('./db.cjs');

// Generate unique document ID
const generateDocumentID = (prefix) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) AS count FROM documents WHERE type = ?';
        db.query(sql, [prefix], (error, results) => {
            if (error) {
                console.error('❌ Error generating document ID:', error);
                reject(error);
                return;
            }
            const count = results[0].count + 1;
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            resolve(`${prefix}-${year}${month}${String(count).padStart(4, '0')}`);
        });
    });
};

// Create Quotation
const createQuotation = async (req, res) => {
    try {
        const { client, items, totalAmount, vat, withholding, status } = req.body;
        const docID = await generateDocumentID('QO');

        const sql = 'INSERT INTO documents (doc_id, client, items, total_amount, vat, withholding, status, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [docID, client, JSON.stringify(items), totalAmount, vat, withholding, status, 'quotation'], (error) => {
            if (error) {
                console.error('❌ Error creating quotation:', error);
                res.status(500).json({ success: false, message: 'Error creating quotation' });
                return;
            }
            res.json({ success: true, message: 'Quotation created', docID });
        });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { createQuotation };
