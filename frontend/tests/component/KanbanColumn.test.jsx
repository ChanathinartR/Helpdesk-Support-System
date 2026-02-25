import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import KanbanColumn from '../../src/features/tickets/components/KanbanColumn';

// ─── Mock ─────────────────────────────────────────────────────────────────────

vi.mock('@dnd-kit/core', () => ({
  useDroppable: () => ({ setNodeRef: vi.fn() }),
}));

vi.mock('../../src/features/tickets/components/TicketCard', () => ({
  default: ({ ticket, role, isDraggable }) => (
    <div data-testid={`card-${ticket.id}`}>
      <span data-testid={`card-title-${ticket.id}`}>{ticket.title}</span>
      <span data-testid={`card-role-${ticket.id}`}>{role}</span>
      <span data-testid={`card-draggable-${ticket.id}`}>{String(isDraggable)}</span>
    </div>
  ),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const statusPending  = { id: 'pending',  label: 'Pending',  color: 'bg-pink-500',  bgColor: 'bg-pink-50'  };
const statusAccepted = { id: 'accepted', label: 'Accepted', color: 'bg-blue-500',  bgColor: 'bg-blue-50'  };
const statusResolved = { id: 'resolved', label: 'Resolved', color: 'bg-green-500', bgColor: 'bg-green-50' };
const statusRejected = { id: 'rejected', label: 'Rejected', color: 'bg-red-500',   bgColor: 'bg-red-50'   };

const mockItems = [
  { id: 1, title: 'Login ไม่ได้',     status: 'pending' },
  { id: 2, title: 'Page not loading', status: 'pending' },
];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('KanbanColumn', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────────────────

  describe('การแสดงผล', () => {

    it('แสดง label ของ column', () => {
      render(<KanbanColumn status={statusPending} items={mockItems} role="user" />);
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('แสดงจำนวน items ใน badge', () => {
      render(<KanbanColumn status={statusPending} items={mockItems} role="user" />);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('แสดง badge จำนวน 0 เมื่อไม่มี items', () => {
      render(<KanbanColumn status={statusPending} items={[]} role="user" />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('แสดง TicketCard สำหรับทุก item', () => {
      render(<KanbanColumn status={statusPending} items={mockItems} role="user" />);
      expect(screen.getByTestId('card-1')).toBeInTheDocument();
      expect(screen.getByTestId('card-2')).toBeInTheDocument();
    });

    it('ไม่แสดง TicketCard เมื่อ items ว่าง', () => {
      render(<KanbanColumn status={statusPending} items={[]} role="user" />);
      expect(screen.queryByTestId('card-1')).not.toBeInTheDocument();
    });

    it('ใช้ bgColor จาก status prop', () => {
      const { container } = render(<KanbanColumn status={statusPending} items={[]} role="user" />);
      expect(container.firstChild.className).toContain('bg-pink-50');
    });

    it('ส่ง isDraggable=true ให้ทุก TicketCard', () => {
      render(<KanbanColumn status={statusPending} items={mockItems} role="user" />);
      expect(screen.getByTestId('card-draggable-1').textContent).toBe('true');
      expect(screen.getByTestId('card-draggable-2').textContent).toBe('true');
    });

  });

  // ── Role ─────────────────────────────────────────────────────────────────

  describe('ส่ง role ให้ TicketCard', () => {

    it('role = user', () => {
      render(<KanbanColumn status={statusPending} items={mockItems} role="user" />);
      expect(screen.getByTestId('card-role-1').textContent).toBe('user');
      expect(screen.getByTestId('card-role-2').textContent).toBe('user');
    });

    it('role = staff', () => {
      render(<KanbanColumn status={statusPending} items={mockItems} role="staff" />);
      expect(screen.getByTestId('card-role-1').textContent).toBe('staff');
    });

    it('role = admin', () => {
      render(<KanbanColumn status={statusPending} items={mockItems} role="admin" />);
      expect(screen.getByTestId('card-role-1').textContent).toBe('admin');
    });

  });

  // ── Status label ──────────────────────────────────────────────────────────

  describe('Status label ต่างๆ', () => {

    it('แสดง label Accepted', () => {
      render(<KanbanColumn status={statusAccepted} items={[]} role="user" />);
      expect(screen.getByText('Accepted')).toBeInTheDocument();
    });

    it('แสดง label Resolved', () => {
      render(<KanbanColumn status={statusResolved} items={[]} role="user" />);
      expect(screen.getByText('Resolved')).toBeInTheDocument();
    });

    it('แสดง label Rejected', () => {
      render(<KanbanColumn status={statusRejected} items={[]} role="user" />);
      expect(screen.getByText('Rejected')).toBeInTheDocument();
    });

  });

  // ── bgColor ───────────────────────────────────────────────────────────────

  describe('bgColor ตาม status', () => {

    it('accepted ใช้ bg-blue-50', () => {
      const { container } = render(<KanbanColumn status={statusAccepted} items={[]} role="user" />);
      expect(container.firstChild.className).toContain('bg-blue-50');
    });

    it('resolved ใช้ bg-green-50', () => {
      const { container } = render(<KanbanColumn status={statusResolved} items={[]} role="user" />);
      expect(container.firstChild.className).toContain('bg-green-50');
    });

    it('rejected ใช้ bg-red-50', () => {
      const { container } = render(<KanbanColumn status={statusRejected} items={[]} role="user" />);
      expect(container.firstChild.className).toContain('bg-red-50');
    });

  });

});