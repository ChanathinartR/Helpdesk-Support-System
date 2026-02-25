// backend/tests/server.test.js

const request = require('supertest');
const express = require('express');
const cors = require('cors');

// ─── Mock db (pool) ───────────────────────────────────────────────────────────

const mockQuery = jest.fn();

jest.mock('../db', () => ({
  query: mockQuery,
}));

// ─── Setup app เหมือน server.js แต่ไม่ app.listen ───────────────────────────

const pool = require('../db');
const app = express();
app.use(cors());
app.use(express.json());

const validateTicket = (req, res, next) => {
  const { title, description, contact } = req.body;
  if (req.method === 'POST') {
    if (!title?.trim() || !description?.trim() || !contact?.trim()) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
    }
  }
  next();
};

app.post('/api/tickets', validateTicket, async (req, res) => {
  const { title, description, contact } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tickets (title, description, contact, status, created_at, updated_at) VALUES ($1, $2, $3, 'pending', NOW(), NOW()) RETURNING *`,
      [title.trim(), description.trim(), contact.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

app.get('/api/tickets', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM tickets ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put('/api/tickets/:id', validateTicket, async (req, res) => {
  const { id } = req.params;
  const { title, description, contact, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tickets SET title = COALESCE($1, title), description = COALESCE($2, description), contact = COALESCE($3, contact), status = COALESCE($4, status), updated_at = NOW() WHERE id = $5 RETURNING *`,
      [title, description, contact, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Ticket not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

app.patch('/api/tickets/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowedStatus = ['pending', 'accepted', 'resolved', 'rejected'];
  if (!status || !allowedStatus.includes(status)) {
    return res.status(400).json({ error: `Status ต้องเป็น: ${allowedStatus.join(', ')}` });
  }
  try {
    const result = await pool.query(
      `UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Ticket not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockTicket = {
  id: 1,
  title: 'Login ไม่ได้',
  description: 'หน้าจอค้าง',
  contact: 'user@test.com',
  status: 'pending',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Ticket API', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── GET /api/tickets ──────────────────────────────────────────────────────

  describe('GET /api/tickets', () => {

    it('200 — คืน array ของตั๋วทั้งหมด', async () => {
      mockQuery.mockResolvedValue({ rows: [mockTicket] });
      const res = await request(app).get('/api/tickets');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockTicket]);
    });

    it('200 — คืน array ว่างเมื่อไม่มีตั๋ว', async () => {
      mockQuery.mockResolvedValue({ rows: [] });
      const res = await request(app).get('/api/tickets');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('500 — server error เมื่อ query ล้มเหลว', async () => {
      mockQuery.mockRejectedValue(new Error('DB Error'));
      const res = await request(app).get('/api/tickets');
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Server error');
    });

  });

  // ── POST /api/tickets ─────────────────────────────────────────────────────

  describe('POST /api/tickets', () => {

    const validBody = {
      title: 'Login ไม่ได้',
      description: 'หน้าจอค้าง',
      contact: 'user@test.com',
    };

    it('201 — สร้างตั๋วสำเร็จ', async () => {
      mockQuery.mockResolvedValue({ rows: [mockTicket] });
      const res = await request(app).post('/api/tickets').send(validBody);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockTicket);
    });

    it('201 — status เริ่มต้นเป็น pending', async () => {
      mockQuery.mockResolvedValue({ rows: [{ ...mockTicket, status: 'pending' }] });
      const res = await request(app).post('/api/tickets').send(validBody);
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('pending');
    });

    it('400 — ไม่ส่ง title', async () => {
      const res = await request(app).post('/api/tickets').send({
        description: 'หน้าจอค้าง',
        contact: 'user@test.com',
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('400 — ไม่ส่ง description', async () => {
      const res = await request(app).post('/api/tickets').send({
        title: 'Login ไม่ได้',
        contact: 'user@test.com',
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('400 — ไม่ส่ง contact', async () => {
      const res = await request(app).post('/api/tickets').send({
        title: 'Login ไม่ได้',
        description: 'หน้าจอค้าง',
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('400 — ส่งแต่ whitespace', async () => {
      const res = await request(app).post('/api/tickets').send({
        title: '   ',
        description: '   ',
        contact: '   ',
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('400 — ส่ง body ว่าง', async () => {
      const res = await request(app).post('/api/tickets').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('500 — server error เมื่อ query ล้มเหลว', async () => {
      mockQuery.mockRejectedValue(new Error('DB Error'));
      const res = await request(app).post('/api/tickets').send(validBody);
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Server error');
    });

  });

  // ── PUT /api/tickets/:id ──────────────────────────────────────────────────

  describe('PUT /api/tickets/:id', () => {

    const updateBody = {
      title: 'แก้ไขแล้ว',
      description: 'แก้ไข description',
      contact: 'new@test.com',
      status: 'accepted',
    };

    it('200 — อัปเดตตั๋วสำเร็จ', async () => {
      const updated = { ...mockTicket, ...updateBody };
      mockQuery.mockResolvedValue({ rows: [updated] });
      const res = await request(app).put('/api/tickets/1').send(updateBody);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('แก้ไขแล้ว');
    });

    it('200 — อัปเดตบาง field ด้วย COALESCE', async () => {
      const updated = { ...mockTicket, status: 'accepted' };
      mockQuery.mockResolvedValue({ rows: [updated] });
      const res = await request(app).put('/api/tickets/1').send({ status: 'accepted' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('accepted');
    });

    it('404 — ticket ไม่มีใน DB', async () => {
      mockQuery.mockResolvedValue({ rows: [] });
      const res = await request(app).put('/api/tickets/999').send(updateBody);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Ticket not found');
    });

    it('500 — server error เมื่อ query ล้มเหลว', async () => {
      mockQuery.mockRejectedValue(new Error('DB Error'));
      const res = await request(app).put('/api/tickets/1').send(updateBody);
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Server error');
    });

  });

  // ── PATCH /api/tickets/:id ────────────────────────────────────────────────

  describe('PATCH /api/tickets/:id', () => {

    it('200 — อัปเดต status เป็น accepted', async () => {
      mockQuery.mockResolvedValue({ rows: [{ ...mockTicket, status: 'accepted' }] });
      const res = await request(app).patch('/api/tickets/1').send({ status: 'accepted' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('accepted');
    });

    it('200 — อัปเดต status เป็น resolved', async () => {
      mockQuery.mockResolvedValue({ rows: [{ ...mockTicket, status: 'resolved' }] });
      const res = await request(app).patch('/api/tickets/1').send({ status: 'resolved' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('resolved');
    });

    it('200 — อัปเดต status เป็น rejected', async () => {
      mockQuery.mockResolvedValue({ rows: [{ ...mockTicket, status: 'rejected' }] });
      const res = await request(app).patch('/api/tickets/1').send({ status: 'rejected' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('rejected');
    });

    it('200 — อัปเดต status เป็น pending', async () => {
      mockQuery.mockResolvedValue({ rows: [{ ...mockTicket, status: 'pending' }] });
      const res = await request(app).patch('/api/tickets/1').send({ status: 'pending' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('pending');
    });

    it('400 — status ไม่อยู่ใน allowedStatus', async () => {
      const res = await request(app).patch('/api/tickets/1').send({ status: 'unknown' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('400 — ไม่ส่ง status', async () => {
      const res = await request(app).patch('/api/tickets/1').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('404 — ticket ไม่มีใน DB', async () => {
      mockQuery.mockResolvedValue({ rows: [] });
      const res = await request(app).patch('/api/tickets/999').send({ status: 'accepted' });
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Ticket not found');
    });

    it('500 — server error เมื่อ query ล้มเหลว', async () => {
      mockQuery.mockRejectedValue(new Error('DB Error'));
      const res = await request(app).patch('/api/tickets/1').send({ status: 'accepted' });
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Server error');
    });

  });

});
