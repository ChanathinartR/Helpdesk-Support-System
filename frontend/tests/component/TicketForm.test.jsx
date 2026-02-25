// tests/unit/TicketForm.test.jsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TicketForm from '../../src/features/tickets/components/TicketForm';

// ─── Mock ─────────────────────────────────────────────────────────────────────

const mockAddTicket = vi.fn();

vi.mock('../../src/store/TicketContext', () => ({
    useTickets: () => ({
        addTicket: mockAddTicket,
    }),
}));

// Mock window.alert ป้องกัน jsdom error
const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => { });

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fillForm = ({ title = '', description = '', contact = '' } = {}) => {
    if (title) fireEvent.change(screen.getByPlaceholderText('Issue Title'), { target: { value: title } });
    if (description) fireEvent.change(screen.getByPlaceholderText('Describe your problem...'), { target: { value: description } });
    if (contact) fireEvent.change(screen.getByPlaceholderText('Email / Phone'), { target: { value: contact } });
};

const submitForm = () => fireEvent.click(screen.getByRole('button', { name: 'Create Ticket' }));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('TicketForm', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        render(<TicketForm />);
    });

    // ── Rendering ────────────────────────────────────────────────────────────

    describe('การแสดงผล', () => {

        it('แสดง heading "Issue Ticket"', () => {
            expect(screen.getByText('Issue Ticket')).toBeInTheDocument();
        });

        it('แสดง input ครบทุกช่อง', () => {
            expect(screen.getByPlaceholderText('Issue Title')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Describe your problem...')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Email / Phone')).toBeInTheDocument();
        });

        it('แสดงปุ่ม Create Ticket', () => {
            expect(screen.getByRole('button', { name: 'Create Ticket' })).toBeInTheDocument();
        });

        it('ค่าเริ่มต้นของ input ทุกช่องเป็นค่าว่าง', () => {
            expect(screen.getByPlaceholderText('Issue Title').value).toBe('');
            expect(screen.getByPlaceholderText('Describe your problem...').value).toBe('');
            expect(screen.getByPlaceholderText('Email / Phone').value).toBe('');
        });

    });

    // ── Validation ───────────────────────────────────────────────────────────

    describe('Validation — กรอกข้อมูลไม่ครบ', () => {

        it('ไม่กรอกอะไรเลย — แสดง alert error', () => {
            submitForm();
            expect(mockAlert).toHaveBeenCalledWith("Error: Please fill in all fields.");
            expect(mockAddTicket).not.toHaveBeenCalled();
        });

        it('กรอกบางช่อง — แสดง alert error', () => {
            fillForm({ title: 'Issue 1' });
            submitForm();
            expect(mockAlert).toHaveBeenCalledWith("Error: Please fill in all fields.");
            expect(mockAddTicket).not.toHaveBeenCalled();
        });
    });
});