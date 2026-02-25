import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { ticketService } from '../../src/features/tickets/services/ticketService';

// ─── Mock axios ───────────────────────────────────────────────────────────────

vi.mock('axios');

const API_URL = 'http://localhost:5000/api/tickets';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockTicket = {
  id: 1,
  title: 'Login ไม่ได้',
  description: 'หน้าจอค้าง',
  contact: 'user@example.com',
  status: 'pending',
};

const mockTickets = [
  mockTicket,
  { id: 2, title: 'Page not loading', status: 'accepted' },
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ticketService', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── getAll ────────────────────────────────────────────────────────────────

  describe('getAll()', () => {

    it('เรียก GET ไปที่ API_URL ที่ถูกต้อง', async () => {
      axios.get.mockResolvedValue({ data: mockTickets });
      await ticketService.getAll();
      expect(axios.get).toHaveBeenCalledWith(API_URL);
    });

    it('คืนค่า data จาก response', async () => {
      axios.get.mockResolvedValue({ data: mockTickets });
      const result = await ticketService.getAll();
      expect(result).toEqual(mockTickets);
    });

    it('คืน array ว่างเมื่อไม่มีตั๋ว', async () => {
      axios.get.mockResolvedValue({ data: [] });
      const result = await ticketService.getAll();
      expect(result).toEqual([]);
    });

    it('throw error เมื่อ request ล้มเหลว', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));
      await expect(ticketService.getAll()).rejects.toThrow('Network Error');
    });

  });

  // ── create ────────────────────────────────────────────────────────────────

  describe('create()', () => {

    const newTicketData = {
      title: 'Bug ใหม่',
      description: 'พบ bug',
      contact: 'dev@example.com',
    };

    it('เรียก POST ไปที่ API_URL ที่ถูกต้อง', async () => {
      axios.post.mockResolvedValue({ data: { id: 3, ...newTicketData } });
      await ticketService.create(newTicketData);
      expect(axios.post).toHaveBeenCalledWith(API_URL, newTicketData);
    });

    it('คืนค่า ticket ที่ถูกสร้างจาก response', async () => {
      const created = { id: 3, ...newTicketData, status: 'pending' };
      axios.post.mockResolvedValue({ data: created });
      const result = await ticketService.create(newTicketData);
      expect(result).toEqual(created);
    });

    it('ส่ง ticketData ไปกับ request ครบถ้วน', async () => {
      axios.post.mockResolvedValue({ data: {} });
      await ticketService.create(newTicketData);
      expect(axios.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          title: 'Bug ใหม่',
          description: 'พบ bug',
          contact: 'dev@example.com',
        })
      );
    });

    it('throw error เมื่อ request ล้มเหลว', async () => {
      axios.post.mockRejectedValue(new Error('Server Error'));
      await expect(ticketService.create(newTicketData)).rejects.toThrow('Server Error');
    });

  });

  // ── update ────────────────────────────────────────────────────────────────

  describe('update()', () => {

    const updatedData = { title: 'แก้ไขแล้ว', status: 'accepted' };

    it('เรียก PUT ไปที่ URL พร้อม id ที่ถูกต้อง', async () => {
      axios.put.mockResolvedValue({ data: { ...mockTicket, ...updatedData } });
      await ticketService.update(1, updatedData);
      expect(axios.put).toHaveBeenCalledWith(`${API_URL}/1`, updatedData);
    });

    it('คืนค่า ticket ที่อัปเดตแล้วจาก response', async () => {
      const updated = { ...mockTicket, ...updatedData };
      axios.put.mockResolvedValue({ data: updated });
      const result = await ticketService.update(1, updatedData);
      expect(result).toEqual(updated);
    });

    it('ส่ง updatedData ไปกับ request ครบถ้วน', async () => {
      axios.put.mockResolvedValue({ data: {} });
      await ticketService.update(1, updatedData);
      expect(axios.put).toHaveBeenCalledWith(
        `${API_URL}/1`,
        expect.objectContaining({ title: 'แก้ไขแล้ว', status: 'accepted' })
      );
    });

    it('ใช้ id ที่ถูกต้องใน URL', async () => {
      axios.put.mockResolvedValue({ data: {} });
      await ticketService.update(99, updatedData);
      expect(axios.put).toHaveBeenCalledWith(`${API_URL}/99`, updatedData);
    });

    it('throw error เมื่อ request ล้มเหลว', async () => {
      axios.put.mockRejectedValue(new Error('Not Found'));
      await expect(ticketService.update(1, updatedData)).rejects.toThrow('Not Found');
    });

  });

  // ── delete ────────────────────────────────────────────────────────────────

  describe('delete()', () => {

    it('เรียก DELETE ไปที่ URL พร้อม id ที่ถูกต้อง', async () => {
      axios.delete.mockResolvedValue({});
      await ticketService.delete(1);
      expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/1`);
    });

    it('คืนค่า id ที่ถูกลบ', async () => {
      axios.delete.mockResolvedValue({});
      const result = await ticketService.delete(1);
      expect(result).toBe(1);
    });

    it('ใช้ id ที่ถูกต้องใน URL', async () => {
      axios.delete.mockResolvedValue({});
      await ticketService.delete(42);
      expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/42`);
    });

    it('throw error เมื่อ request ล้มเหลว', async () => {
      axios.delete.mockRejectedValue(new Error('Forbidden'));
      await expect(ticketService.delete(1)).rejects.toThrow('Forbidden');
    });

  });

});