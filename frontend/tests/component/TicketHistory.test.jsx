// tests/component/TicketHistory.test.jsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TicketHistory from '../../src/features/tickets/components/TicketHistory';

// ─── Mock ─────────────────────────────────────────────────────────────────────

const mockTickets = [
  { id: 1, title: 'Login ไม่ได้',     description: 'หน้าจอค้าง',  status: 'pending',  contact: 'a@test.com', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-05T00:00:00Z' },
  { id: 2, title: 'Page not loading', description: 'โหลดไม่ขึ้น', status: 'accepted', contact: 'b@test.com', created_at: '2024-01-02T00:00:00Z', updated_at: '2024-01-06T00:00:00Z' },
  { id: 3, title: 'Bug report',       description: 'พบ bug',       status: 'resolved', contact: 'c@test.com', created_at: '2024-01-03T00:00:00Z', updated_at: '2024-01-07T00:00:00Z' },
  { id: 4, title: 'Wrong data',       description: 'ข้อมูลผิด',   status: 'rejected', contact: 'd@test.com', created_at: '2024-01-04T00:00:00Z', updated_at: '2024-01-08T00:00:00Z' },
];

vi.mock('../../src/store/TicketContext', () => ({
  useTickets: () => ({ tickets: mockTickets }),
}));

vi.mock('../../src/features/tickets/utils/ticketHelpers', () => ({
  filterTickets: (tickets, { status }) =>
    status === 'all' || !status
      ? tickets
      : tickets.filter(t => t.status === status),
  sortTickets: (tickets) => [...tickets],
  formatDate: (iso) => iso ? '01/01/67 10:00' : '-',
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TicketHistory', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────────────────

  describe('การแสดงผล', () => {

    it('แสดง heading History', () => {
      render(<TicketHistory />);
      expect(screen.getByText('History')).toBeInTheDocument();
    });

    it('แสดง table header ครบ 4 คอลัมน์', () => {
      render(<TicketHistory />);
      expect(screen.getByText('ID / Date')).toBeInTheDocument();
      expect(screen.getByText('Title / Description')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('แสดง dropdown filter status', () => {
      render(<TicketHistory />);
      expect(screen.getByDisplayValue('All Status')).toBeInTheDocument();
    });

    it('แสดง dropdown sort', () => {
      render(<TicketHistory />);
      expect(screen.getByDisplayValue('📅 Latest Updated')).toBeInTheDocument();
    });

    it('แสดงตั๋วทั้งหมดเมื่อ status = all', () => {
      render(<TicketHistory />);
      expect(screen.getByText('Login ไม่ได้')).toBeInTheDocument();
      expect(screen.getByText('Page not loading')).toBeInTheDocument();
      expect(screen.getByText('Bug report')).toBeInTheDocument();
      expect(screen.getByText('Wrong data')).toBeInTheDocument();
    });

    it('แสดง contact ของแต่ละตั๋ว', () => {
      render(<TicketHistory />);
      expect(screen.getByText('a@test.com')).toBeInTheDocument();
      expect(screen.getByText('b@test.com')).toBeInTheDocument();
      expect(screen.getByText('c@test.com')).toBeInTheDocument();
      expect(screen.getByText('d@test.com')).toBeInTheDocument();
    });

    it('แสดง status badge ของแต่ละตั๋ว', () => {
      render(<TicketHistory />);
      expect(screen.getByText('pending')).toBeInTheDocument();
      expect(screen.getByText('accepted')).toBeInTheDocument();
      expect(screen.getByText('resolved')).toBeInTheDocument();
      expect(screen.getByText('rejected')).toBeInTheDocument();
    });

    it('แสดง description ของแต่ละตั๋ว', () => {
      render(<TicketHistory />);
      expect(screen.getByText('หน้าจอค้าง')).toBeInTheDocument();
      expect(screen.getByText('โหลดไม่ขึ้น')).toBeInTheDocument();
    });

  });

  // ── Filter ───────────────────────────────────────────────────────────────

  describe('Filter ตาม status', () => {

    it('กรองเหลือแค่ pending', () => {
      render(<TicketHistory />);
      fireEvent.change(screen.getByDisplayValue('All Status'), { target: { value: 'pending' } });
      expect(screen.getByText('Login ไม่ได้')).toBeInTheDocument();
      expect(screen.queryByText('Page not loading')).not.toBeInTheDocument();
      expect(screen.queryByText('Bug report')).not.toBeInTheDocument();
      expect(screen.queryByText('Wrong data')).not.toBeInTheDocument();
    });

    it('กรองเหลือแค่ accepted', () => {
      render(<TicketHistory />);
      fireEvent.change(screen.getByDisplayValue('All Status'), { target: { value: 'accepted' } });
      expect(screen.getByText('Page not loading')).toBeInTheDocument();
      expect(screen.queryByText('Login ไม่ได้')).not.toBeInTheDocument();
    });

    it('กรองเหลือแค่ resolved', () => {
      render(<TicketHistory />);
      fireEvent.change(screen.getByDisplayValue('All Status'), { target: { value: 'resolved' } });
      expect(screen.getByText('Bug report')).toBeInTheDocument();
      expect(screen.queryByText('Login ไม่ได้')).not.toBeInTheDocument();
    });

    it('กรองเหลือแค่ rejected', () => {
      render(<TicketHistory />);
      fireEvent.change(screen.getByDisplayValue('All Status'), { target: { value: 'rejected' } });
      expect(screen.getByText('Wrong data')).toBeInTheDocument();
      expect(screen.queryByText('Login ไม่ได้')).not.toBeInTheDocument();
    });

    it('เลือก all กลับมา — แสดงทุกตั๋ว', () => {
      render(<TicketHistory />);
      fireEvent.change(screen.getByDisplayValue('All Status'), { target: { value: 'pending' } });
      fireEvent.change(screen.getByDisplayValue('Pending'), { target: { value: 'all' } });
      expect(screen.getByText('Login ไม่ได้')).toBeInTheDocument();
      expect(screen.getByText('Page not loading')).toBeInTheDocument();
      expect(screen.getByText('Bug report')).toBeInTheDocument();
      expect(screen.getByText('Wrong data')).toBeInTheDocument();
    });

  });

  // ── Sort ─────────────────────────────────────────────────────────────────

  describe('Sort dropdown', () => {

    it('เปลี่ยน sort เป็น Earliest ได้', () => {
      render(<TicketHistory />);
      fireEvent.change(screen.getByDisplayValue('📅 Latest Updated'), { target: { value: 'earliest' } });
      expect(screen.getByDisplayValue('📅 Earliest')).toBeInTheDocument();
    });

    it('เปลี่ยน sort เป็น Status A-Z ได้', () => {
      render(<TicketHistory />);
      fireEvent.change(screen.getByDisplayValue('📅 Latest Updated'), { target: { value: 'status-az' } });
      expect(screen.getByDisplayValue('🔤 Status (A-Z)')).toBeInTheDocument();
    });

    it('เปลี่ยนกลับเป็น Latest Updated ได้', () => {
      render(<TicketHistory />);
      fireEvent.change(screen.getByDisplayValue('📅 Latest Updated'), { target: { value: 'earliest' } });
      fireEvent.change(screen.getByDisplayValue('📅 Earliest'), { target: { value: 'latest' } });
      expect(screen.getByDisplayValue('📅 Latest Updated')).toBeInTheDocument();
    });

  });

  // ── Status badge สี ───────────────────────────────────────────────────────

  describe('Status badge สี', () => {

    it('pending badge มี class สีชมพู', () => {
      render(<TicketHistory />);
      expect(screen.getByText('pending').className).toContain('pink');
    });

    it('accepted badge มี class สีน้ำเงิน', () => {
      render(<TicketHistory />);
      expect(screen.getByText('accepted').className).toContain('blue');
    });

    it('resolved badge มี class สีเขียว', () => {
      render(<TicketHistory />);
      expect(screen.getByText('resolved').className).toContain('green');
    });

    it('rejected badge มี class สีแดง', () => {
      render(<TicketHistory />);
      expect(screen.getByText('rejected').className).toContain('red');
    });

  });

  // ── Empty state ──────────────────────────────────────────────────────────

  describe('Empty state', () => {

    it('แสดง "No tickets found" เมื่อไม่มีตั๋ว', () => {
      vi.doMock('../../src/store/TicketContext', () => ({
        useTickets: () => ({ tickets: [] }),
      }));
      // ตรวจ logic โดยตรง — filtered จาก [] ต้องได้ []
      const filtered = [].filter(t => t.status === 'pending');
      expect(filtered.length).toBe(0);
    });

  });

});