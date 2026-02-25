// tests/unit/ticketHelpers.test.js

import { describe, it, expect } from 'vitest';
import { 
  formatDate, 
  filterTickets, 
  sortTickets, 
  getTicketStats 
} from '../../src/features/tickets/utils/ticketHelpers';

describe('Ticket Helpers', () => {

  // ─── formatDate ───────────────────────────────────────────────────────────
  describe('formatDate', () => {

    it('จัดรูปแบบวันที่ ISO เป็นรูปแบบ th-TH ที่อ่านง่าย', () => {
      const isoDate = "2024-07-15T10:00:00.000Z"; 
      const result = formatDate(isoDate);

      expect(result).toContain("15");   // วัน
      expect(result).toContain("07");   // เดือน
      expect(result).toContain("67");   // ปีพุทธศักราช 2024+543=2567 -> แสดง 2 หลัก = "67"
    });

    it('แสดงปีพุทธศักราชสำหรับปี 2025', () => {
      const isoDate = "2025-01-01T05:00:00.000Z";
      const result = formatDate(isoDate);
      expect(result).toContain("68"); // 2025+543=2568 -> "68"
    });

    it('คืนค่า "-" เมื่อได้รับค่า null', () => {
      expect(formatDate(null)).toBe("-");
    });

    it('คืนค่า "-" เมื่อได้รับค่า undefined', () => {
      expect(formatDate(undefined)).toBe("-");
    });

    it('คืนค่า "-" เมื่อรูปแบบวันที่ไม่ถูกต้อง', () => {
      expect(formatDate("invalid-date")).toBe("-");
      expect(formatDate("")).toBe("-");
      expect(formatDate("not-a-date")).toBe("-");
    });
  });

  // ─── filterTickets ─────────────────────────────────────────────────────────
  describe('filterTickets', () => {
    const tickets = [
      { id: 1, title: "Issue with login", status: "pending" },
      { id: 2, title: "Page not loading", status: "accepted" },
      { id: 3, title: "Login button broken", status: "resolved" },
    ];

    it('กรองตั๋วตามสถานะที่กำหนด', () => {
      const result = filterTickets(tickets, { status: "pending", searchTerm: "" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('คืนตั๋วทั้งหมดเมื่อ status เป็น "all"', () => {
      const result = filterTickets(tickets, { status: "all", searchTerm: "" });
      expect(result).toHaveLength(3);
    });

    it('คืนตั๋วทั้งหมดเมื่อไม่มี filter', () => {
      const result = filterTickets(tickets, { status: "", searchTerm: "" });
      expect(result).toHaveLength(3);
    });

    it('กรองตั๋วตาม searchTerm (case-insensitive)', () => {
      const result = filterTickets(tickets, { status: "", searchTerm: "LOGIN" });
      expect(result).toHaveLength(2); // id 1 และ 3
      expect(result.map(t => t.id)).toEqual([1, 3]);
    });

    it('กรองตั๋วด้วย status และ searchTerm พร้อมกัน', () => {
      const result = filterTickets(tickets, { status: "resolved", searchTerm: "login" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it('คืน array ว่างเมื่อไม่มีตั๋วที่ตรงกับ filter', () => {
      const result = filterTickets(tickets, { status: "rejected", searchTerm: "" });
      expect(result).toHaveLength(0);
    });
  });

  // ─── sortTickets ───────────────────────────────────────────────────────────
  describe('sortTickets', () => {
    const tickets = [
      { id: 1, status: "resolved", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-12-31T20:00:00Z" },
      { id: 2, status: "pending",  created_at: "2024-06-15T00:00:00Z", updated_at: "2024-12-31T23:59:59Z" },
      { id: 3, status: "accepted", created_at: "2024-03-01T00:00:00Z", updated_at: "2024-12-31T10:00:00Z" },
    ];

    it('เรียงตามวันที่อัปเดตล่าสุด (latest)', () => {
      const result = sortTickets(tickets, 'latest');
      expect(result[0].id).toBe(2); // updated_at ล่าสุด
      expect(result[1].id).toBe(1);
      expect(result[2].id).toBe(3);
    });

    it('เรียงตามวันที่สร้างเก่าสุดก่อน (earliest)', () => {
      const result = sortTickets(tickets, 'earliest');
      expect(result[0].id).toBe(1); // created_at เก่าสุด
      expect(result[1].id).toBe(3);
      expect(result[2].id).toBe(2);
    });

    it('เรียงตามสถานะ A-Z', () => {
      // ✅ Fix: localeCompare ระบุ locale 'en' เพื่อให้ผลลัพธ์ consistent
      const result = sortTickets(tickets, 'status-az');
      expect(result[0].status).toBe("accepted"); // A
      expect(result[1].status).toBe("pending");  // P
      expect(result[2].status).toBe("resolved"); // R
    });

    it('ใช้ created_at เมื่อไม่มี updated_at สำหรับ latest', () => {
      const ticketsNoUpdate = [
        { id: 1, created_at: "2024-01-01T00:00:00Z" },
        { id: 2, created_at: "2024-06-15T00:00:00Z" },
      ];
      const result = sortTickets(ticketsNoUpdate, 'latest');
      expect(result[0].id).toBe(2);
    });

    it('คืน array เดิมสำหรับ sortBy ที่ไม่รู้จัก (default)', () => {
      const result = sortTickets(tickets, 'unknown');
      expect(result.map(t => t.id)).toEqual([1, 2, 3]);
    });

    it('ไม่ mutate array ต้นฉบับ', () => {
      const original = [...tickets];
      sortTickets(tickets, 'status-az');
      expect(tickets.map(t => t.id)).toEqual(original.map(t => t.id));
    });
  });

  // ─── getTicketStats ────────────────────────────────────────────────────────
  describe('getTicketStats', () => {
    it('นับสถิติตั๋วทุกสถานะได้ถูกต้อง', () => {
      const tickets = [
        { status: "pending" },
        { status: "pending" },
        { status: "accepted" },
        { status: "resolved" },
        { status: "rejected" },
      ];
      const stats = getTicketStats(tickets);
      expect(stats.total).toBe(5);
      expect(stats.pending).toBe(2);
      expect(stats.accepted).toBe(1);
      expect(stats.resolved).toBe(1);
      expect(stats.rejected).toBe(1);
    });

    it('คืนค่า 0 สำหรับสถานะที่ไม่มีตั๋ว', () => {
      const tickets = [{ status: "pending" }];
      const stats = getTicketStats(tickets);
      expect(stats.accepted).toBe(0);
      expect(stats.resolved).toBe(0);
      expect(stats.rejected).toBe(0);
    });

    it('คืนค่า total = 0 เมื่อไม่มีตั๋ว', () => {
      const stats = getTicketStats([]);
      expect(stats.total).toBe(0);
      expect(stats.pending).toBe(0);
    });
  });
});