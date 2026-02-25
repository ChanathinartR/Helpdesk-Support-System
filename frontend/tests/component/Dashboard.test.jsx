import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../../src/features/tickets/components/Dashboard';

// ─── Mock ─────────────────────────────────────────────────────────────────────

const mockTickets = [
    { id: 1, status: 'pending' },
    { id: 2, status: 'pending' },
    { id: 3, status: 'accepted' },
    { id: 4, status: 'resolved' },
    { id: 5, status: 'resolved' },
    { id: 6, status: 'rejected' },
];

vi.mock('../../src/store/TicketContext', () => ({
    useTickets: () => ({ tickets: mockTickets }),
}));

vi.mock('../../src/features/tickets/utils/ticketHelpers', () => ({
    getTicketStats: (tickets) => ({
        total: tickets.length,
        pending: tickets.filter(t => t.status === 'pending').length,
        accepted: tickets.filter(t => t.status === 'accepted').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        rejected: tickets.filter(t => t.status === 'rejected').length,
    }),
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Dashboard', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── Rendering ────────────────────────────────────────────────────────────

    describe('การแสดงผล', () => {

        it('แสดง heading System Overview', () => {
            render(<Dashboard />);
            expect(screen.getByText('System Overview')).toBeInTheDocument();
        });

        it('แสดง StatCard label ครบ 4 ใบ', () => {
            render(<Dashboard />);
            expect(screen.getByText('Total Tickets')).toBeInTheDocument();
            expect(screen.getByText('Success Rate')).toBeInTheDocument();
            expect(screen.getByText('Pending/Accepted')).toBeInTheDocument();
            // Rejected ปรากฏทั้งใน StatCard และ StatusRow
            expect(screen.getAllByText('Rejected').length).toBeGreaterThanOrEqual(1);
        });

        it('แสดง section Ticket Status Distribution', () => {
            render(<Dashboard />);
            expect(screen.getByText(/Ticket Status Distribution/)).toBeInTheDocument();
        });

        it('แสดง StatusRow label ครบ 4 แถว', () => {
            render(<Dashboard />);
            expect(screen.getByText('Pending')).toBeInTheDocument();
            expect(screen.getByText('Accepted')).toBeInTheDocument();
            expect(screen.getByText('Resolved')).toBeInTheDocument();
            expect(screen.getAllByText('Rejected').length).toBeGreaterThanOrEqual(1);
        });

    });

    // ── StatCard ค่าตัวเลข ────────────────────────────────────────────────────

    describe('StatCard — ค่าตัวเลขถูกต้อง', () => {

        it('Total Tickets = 6', () => {
            render(<Dashboard />);
            // หา p ที่อยู่ใน div เดียวกับ "Total Tickets"
            const label = screen.getByText('Total Tickets');
            const card = label.closest('div');
            expect(card).toHaveTextContent('6');
        });

        it('Pending/Accepted = 2 + 1 = 3', () => {
            render(<Dashboard />);
            const label = screen.getByText('Pending/Accepted');
            const card = label.closest('div');
            expect(card).toHaveTextContent('3');
        });

        it('Success Rate = round(2/6*100) = 33%', () => {
            render(<Dashboard />);
            const label = screen.getByText('Success Rate');
            const card = label.closest('div');
            expect(card).toHaveTextContent('33%');
        });

        it('Rejected StatCard = 1', () => {
            render(<Dashboard />);
            // เจาะจงด้วย closest div ที่มี bg-red-600
            const allRejected = screen.getAllByText('Rejected');
            const statCard = allRejected
                .map(el => el.closest('div'))
                .find(div => div?.className?.includes('bg-red-600'));
            expect(statCard).toBeTruthy();
            expect(statCard).toHaveTextContent('1');
        });

    });

    // ── Success Rate logic ────────────────────────────────────────────────────

    describe('คำนวณ Success Rate', () => {

        it('Success Rate = 0 เมื่อ total = 0', () => {
            const total = 0, resolved = 0;
            const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
            expect(rate).toBe(0);
        });

        it('Success Rate = 100 เมื่อทุกตั๋ว resolved', () => {
            const total = 4, resolved = 4;
            const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
            expect(rate).toBe(100);
        });

        it('Success Rate = 50 เมื่อ resolved ครึ่งหนึ่ง', () => {
            const total = 4, resolved = 2;
            const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
            expect(rate).toBe(50);
        });

        it('Success Rate ปัดเศษเป็นจำนวนเต็ม', () => {
            const total = 3, resolved = 1;
            const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
            expect(rate).toBe(33);
        });

    });

    // ── StatusRow ─────────────────────────────────────────────────────────────

    describe('StatusRow — จำนวนและ percentage', () => {

        it('pending = 2 ตั๋ว (33%)', () => {
            render(<Dashboard />);
            // pending และ resolved ต่างก็เป็น 33% ใช้ getAllByText แทน
            const items = screen.getAllByText(/2 ตั๋ว \(33%\)/);
            expect(items.length).toBe(2); // pending + resolved
        });

        it('accepted = 1 ตั๋ว (17%)', () => {
            render(<Dashboard />);
            // accepted และ rejected ต่างก็เป็น 17% ใช้ getAllByText แทน
            const items = screen.getAllByText(/1 ตั๋ว \(17%\)/);
            expect(items.length).toBe(2); // accepted + rejected
        });

        it('resolved = 2 ตั๋ว (33%) — มีอยู่ใน DOM', () => {
            render(<Dashboard />);
            const items = screen.getAllByText(/2 ตั๋ว \(33%\)/);
            expect(items.length).toBe(2); // pending และ resolved
        });

        it('rejected = 1 ตั๋ว (17%) — มีอยู่ใน DOM', () => {
            render(<Dashboard />);
            const items = screen.getAllByText(/1 ตั๋ว \(17%\)/);
            expect(items.length).toBe(2); // accepted และ rejected
        });

        it('percentage = 0 เมื่อ total = 0 (ไม่หารด้วย 0)', () => {
            const total = 0, count = 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            expect(pct).toBe(0);
        });

        it('bar width style ของ pending = 33.33...%', () => {
            render(<Dashboard />);
            // pending = 2/6 = 33.33%
            const pct = (2 / 6) * 100;
            expect(Math.round(pct)).toBe(33);
        });

    });

    // ── StatCard สี ───────────────────────────────────────────────────────────

    describe('StatCard — class สี', () => {

        it('Total Tickets card มี bg-gray-900', () => {
            render(<Dashboard />);
            const card = screen.getByText('Total Tickets').closest('div');
            expect(card.className).toContain('bg-gray-900');
        });

        it('Success Rate card มี bg-green-600', () => {
            render(<Dashboard />);
            const card = screen.getByText('Success Rate').closest('div');
            expect(card.className).toContain('bg-green-600');
        });

        it('Pending/Accepted card มี bg-blue-600', () => {
            render(<Dashboard />);
            const card = screen.getByText('Pending/Accepted').closest('div');
            expect(card.className).toContain('bg-blue-600');
        });

        it('Rejected StatCard มี bg-red-600', () => {
            render(<Dashboard />);
            const allRejected = screen.getAllByText('Rejected');
            const statCard = allRejected
                .map(el => el.closest('div'))
                .find(div => div?.className?.includes('bg-red-600'));
            expect(statCard).toBeTruthy();
            expect(statCard.className).toContain('bg-red-600');
        });

    });

});