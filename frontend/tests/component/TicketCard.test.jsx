// tests/component/TicketCard.test.jsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TicketCard from '../../src/features/tickets/components/TicketCard';

const mockUpdateTicketStatus = vi.fn();
const mockUpdateTicket = vi.fn();

vi.mock('../../src/store/TicketContext', () => ({
  useTickets: () => ({
    updateTicketStatus: mockUpdateTicketStatus,
    updateTicket: mockUpdateTicket,
  }),
}));

vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Translate: { toString: () => '' } },
}));

vi.mock('../../src/features/tickets/utils/ticketHelpers', () => ({
  formatDate: (iso) => iso ? '01/01/67 10:00' : '-',
}));

const mockTicket = {
  id: 1,
  title: 'Login ไม่ได้',
  description: 'กดปุ่ม Login แล้วหน้าจอค้าง',
  contact: 'user@example.com',
  status: 'pending',
  created_at: '2024-07-15T10:00:00.000Z',
  updated_at: '2024-07-15T10:00:00.000Z',
};

const mockTicketUpdated = {
  ...mockTicket,
  updated_at: '2024-12-31T20:00:00.000Z',
};

describe('TicketCard', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('การแสดงผลพื้นฐาน', () => {

    it('แสดง title และ description ของตั๋ว', () => {
      render(<TicketCard ticket={mockTicket} role="user" />);
      expect(screen.getByText('Login ไม่ได้')).toBeInTheDocument();
      expect(screen.getByText('กดปุ่ม Login แล้วหน้าจอค้าง')).toBeInTheDocument();
    });

    it('แสดงวันที่สร้าง เมื่อ updated_at = created_at', () => {
      render(<TicketCard ticket={mockTicket} role="user" />);
      expect(screen.getByText('📅 สร้าง:')).toBeInTheDocument();
    });

    it('แสดงวันที่อัปเดต เมื่อ updated_at ต่างจาก created_at', () => {
      render(<TicketCard ticket={mockTicketUpdated} role="user" />);
      expect(screen.getByText('🔄 อัปเดต:')).toBeInTheDocument();
    });

  });

  describe('role = user', () => {

    it('ไม่แสดงปุ่ม Edit', () => {
      render(<TicketCard ticket={mockTicket} role="user" />);
      expect(screen.queryByText('✏️')).not.toBeInTheDocument();
    });

    it('ไม่มี cursor-grab (drag disabled)', () => {
      const { container } = render(<TicketCard ticket={mockTicket} role="user" />);
      expect(container.firstChild.className).not.toContain('cursor-grab');
    });

  });

  describe('role = staff', () => {

    it('ไม่แสดงปุ่ม Edit', () => {
      render(<TicketCard ticket={mockTicket} role="staff" />);
      expect(screen.queryByText('✏️')).not.toBeInTheDocument();
    });

    it('แสดง title และ description ได้ปกติ', () => {
      render(<TicketCard ticket={mockTicket} role="staff" />);
      expect(screen.getByText('Login ไม่ได้')).toBeInTheDocument();
      expect(screen.getByText('กดปุ่ม Login แล้วหน้าจอค้าง')).toBeInTheDocument();
    });

    it('มี cursor-grab (drag enabled)', () => {
      const { container } = render(<TicketCard ticket={mockTicket} role="staff" />);
      expect(container.firstChild.className).toContain('cursor-grab');
    });

    it('แสดงวันที่สร้าง เมื่อ updated_at = created_at', () => {
      render(<TicketCard ticket={mockTicket} role="staff" />);
      expect(screen.getByText('📅 สร้าง:')).toBeInTheDocument();
    });

    it('แสดงวันที่อัปเดต เมื่อ updated_at ต่างจาก created_at', () => {
      render(<TicketCard ticket={mockTicketUpdated} role="staff" />);
      expect(screen.getByText('🔄 อัปเดต:')).toBeInTheDocument();
    });

  });

  describe('role = admin', () => {

    it('แสดงปุ่ม Edit', () => {
      render(<TicketCard ticket={mockTicket} role="admin" />);
      expect(screen.getByText('✏️')).toBeInTheDocument();
    });

    it('มี cursor-grab (drag enabled)', () => {
      const { container } = render(<TicketCard ticket={mockTicket} role="admin" />);
      expect(container.firstChild.className).toContain('cursor-grab');
    });

    it('กดปุ่ม Edit แล้วแสดง input ใน Edit mode', () => {
      render(<TicketCard ticket={mockTicket} role="admin" />);
      fireEvent.click(screen.getByText('✏️'));
      expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Contact')).toBeInTheDocument();
    });

    it('แสดง dropdown status ครบ 4 ตัวเลือกใน Edit mode', () => {
      render(<TicketCard ticket={mockTicket} role="admin" />);
      fireEvent.click(screen.getByText('✏️'));
      expect(screen.getByRole('option', { name: 'pending' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'accepted' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'resolved' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'rejected' })).toBeInTheDocument();
    });

    it('กด Cancel แล้วออกจาก Edit mode', () => {
      render(<TicketCard ticket={mockTicket} role="admin" />);
      fireEvent.click(screen.getByText('✏️'));
      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByPlaceholderText('Title')).not.toBeInTheDocument();
      expect(screen.getByText('Login ไม่ได้')).toBeInTheDocument();
    });

    it('กด Cancel แล้วไม่เรียก updateTicket', () => {
      render(<TicketCard ticket={mockTicket} role="admin" />);
      fireEvent.click(screen.getByText('✏️'));
      fireEvent.click(screen.getByText('Cancel'));
      expect(mockUpdateTicket).not.toHaveBeenCalled();
    });

    it('กด Save แล้วเรียก updateTicket พร้อม id และ editData ที่ถูกต้อง', () => {
      render(<TicketCard ticket={mockTicket} role="admin" />);
      fireEvent.click(screen.getByText('✏️'));
      fireEvent.change(screen.getByPlaceholderText('Title'), {
        target: { value: 'Title ใหม่' },
      });
      fireEvent.click(screen.getByText('Save'));
      expect(mockUpdateTicket).toHaveBeenCalledTimes(1);
      expect(mockUpdateTicket).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ title: 'Title ใหม่' })
      );
    });

    it('กด Save แล้วออกจาก Edit mode', () => {
      render(<TicketCard ticket={mockTicket} role="admin" />);
      fireEvent.click(screen.getByText('✏️'));
      fireEvent.click(screen.getByText('Save'));
      expect(screen.queryByPlaceholderText('Title')).not.toBeInTheDocument();
    });

  });

});