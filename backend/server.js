const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// ============================
// ✅ Middleware: Validate Ticket
// ============================
const validateTicket = (req, res, next) => {
    const { title, description, contact } = req.body;
    
    // ถ้าเป็น POST (สร้างตั๋วใหม่) ต้องเช็คให้ครบ
    if (req.method === 'POST') {
        if (!title?.trim() || !description?.trim() || !contact?.trim()) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
        }
    }
    // ถ้าเป็น PUT/PATCH ปล่อยให้ไปเช็คที่ SQL (ใช้ COALESCE)
    next();
};
// ============================
// POST: สร้างตั๋วใหม่
// ============================
app.post('/api/tickets', validateTicket, async (req, res) => {
    console.log('📥 POST Body:', req.body);

    const { title, description, contact } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO tickets 
                (title, description, contact, status, created_at, updated_at) 
             VALUES ($1, $2, $3, 'pending', NOW(), NOW()) 
             RETURNING *`,
            [title.trim(), description.trim(), contact.trim()]
        );

        console.log('✅ Created:', result.rows[0]);
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error('❌ Error:', err.message);
        res.status(500).json({ error: "Server error", detail: err.message });
    }
});

// ============================
// GET: ดึงตั๋วทั้งหมด
// ============================
app.get('/api/tickets', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM tickets ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error:', err.message);
        res.status(500).json({ error: "Server error" });
    }
});


// ============================
// PUT: อัปเดตตั๋ว (แก้ไขทั้งหมด)
// ============================
app.put('/api/tickets/:id', validateTicket, async (req, res) => {
    const { id } = req.params;
    const { title, description, contact, status } = req.body;

    try {
        const result = await pool.query(
            `UPDATE tickets 
             SET 
                title       = COALESCE($1, title),
                description = COALESCE($2, description),
                contact     = COALESCE($3, contact),
                status      = COALESCE($4, status),
                updated_at  = NOW()
             WHERE id = $5 
             RETURNING *`,
            [title, description, contact, status, id] // ลำดับต้องเป๊ะ $1-$5
        );

        if (result.rows.length === 0) return res.status(404).json({ error: "Ticket not found" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ Update Error:', err.message);
        res.status(500).json({ error: "Server error", detail: err.message });
    }
});

// ============================
// PATCH: อัปเดตแค่ Status (Kanban)
// ============================
app.patch('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log('📥 PATCH Status:', { id, status });

    const allowedStatus = ['pending', 'accepted', 'resolved','rejected']; // ✅ เพิ่มสถานะใหม่ถ้าต้องการ

    // ✅ ตรวจสอบว่า Status ถูกต้อง
    if (!status || !allowedStatus.includes(status)) {
        return res.status(400).json({ 
            error: `Status ต้องเป็น: ${allowedStatus.join(', ')}` 
        });
    }

    try {
        const result = await pool.query(
            `UPDATE tickets 
             SET 
                status     = $1,
                updated_at = NOW()
             WHERE id = $2 
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Ticket not found" });
        }

        console.log('✅ Status Updated:', result.rows[0]);
        res.json(result.rows[0]);

    } catch (err) {
        console.error('❌ Error:', err.message);
        res.status(500).json({ error: "Server error", detail: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));