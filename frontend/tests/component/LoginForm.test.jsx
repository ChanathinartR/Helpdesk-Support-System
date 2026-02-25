import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../../src/features/auth/components/LoginForm';

// ─── Mock ─────────────────────────────────────────────────────────────────────

const mockLogin = vi.fn();

vi.mock('../../src/features/auth/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fillCredentials = (username, password = '') => {
  fireEvent.change(screen.getByPlaceholderText('admin / staff / user'), {
    target: { value: username },
  });
  if (password) {
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: password },
    });
  }
};

const submitForm = () => fireEvent.click(screen.getByRole('button', { name: 'LOG IN' }));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('LoginForm', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    render(<LoginForm />);
  });

  // ── Rendering ────────────────────────────────────────────────────────────

  describe('การแสดงผล', () => {

    it('แสดง heading WELCOME BACK', () => {
      expect(screen.getByText('WELCOME BACK')).toBeInTheDocument();
    });

    it('แสดง input username และ password', () => {
      expect(screen.getByPlaceholderText('admin / staff / user')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('แสดงปุ่ม LOG IN', () => {
      expect(screen.getByRole('button', { name: 'LOG IN' })).toBeInTheDocument();
    });

    it('ค่าเริ่มต้น input เป็นค่าว่าง', () => {
      expect(screen.getByPlaceholderText('admin / staff / user').value).toBe('');
      expect(screen.getByPlaceholderText('••••••••').value).toBe('');
    });

    it('ไม่แสดง error message ตอนแรก', () => {
      expect(screen.queryByText(/ไม่ถูกต้อง/)).not.toBeInTheDocument();
    });

  });

  // ── Login: admin ─────────────────────────────────────────────────────────

  describe('Login สำเร็จ — admin', () => {

    it('เรียก login("admin") เมื่อกรอก admin / 1234', () => {
      fillCredentials('admin', '1234');
      submitForm();
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith('admin');
    });

    it('ไม่แสดง error เมื่อ login admin สำเร็จ', () => {
      fillCredentials('admin', '1234');
      submitForm();
      expect(screen.queryByText(/ไม่ถูกต้อง/)).not.toBeInTheDocument();
    });

  });

  // ── Login: staff ─────────────────────────────────────────────────────────

  describe('Login สำเร็จ — staff', () => {

    it('เรียก login("staff") เมื่อกรอก staff / 1234', () => {
      fillCredentials('staff', '1234');
      submitForm();
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith('staff');
    });

    it('ไม่แสดง error เมื่อ login staff สำเร็จ', () => {
      fillCredentials('staff', '1234');
      submitForm();
      expect(screen.queryByText(/ไม่ถูกต้อง/)).not.toBeInTheDocument();
    });

  });

  // ── Login: user ──────────────────────────────────────────────────────────

  describe('Login สำเร็จ — user (ไม่ต้องใช้ password)', () => {

    it('เรียก login("user") เมื่อกรอก username = user เท่านั้น', () => {
      fillCredentials('user');
      submitForm();
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith('user');
    });

    it('เรียก login("user") แม้กรอก password ด้วย', () => {
      fillCredentials('user', 'anything');
      submitForm();
      expect(mockLogin).toHaveBeenCalledWith('user');
    });

    it('ไม่แสดง error เมื่อ login user สำเร็จ', () => {
      fillCredentials('user');
      submitForm();
      expect(screen.queryByText(/ไม่ถูกต้อง/)).not.toBeInTheDocument();
    });

  });

  // ── Login: failed ─────────────────────────────────────────────────────────

  describe('Login ล้มเหลว', () => {

    it('แสดง error เมื่อ username ผิด', () => {
      fillCredentials('wronguser', '1234');
      submitForm();
      expect(screen.getByText(/ไม่ถูกต้อง/)).toBeInTheDocument();
    });

    it('แสดง error เมื่อ admin ใส่ password ผิด', () => {
      fillCredentials('admin', 'wrongpass');
      submitForm();
      expect(screen.getByText(/ไม่ถูกต้อง/)).toBeInTheDocument();
    });

    it('แสดง error เมื่อ staff ใส่ password ผิด', () => {
      fillCredentials('staff', 'wrongpass');
      submitForm();
      expect(screen.getByText(/ไม่ถูกต้อง/)).toBeInTheDocument();
    });

    it('ไม่เรียก login เมื่อ credentials ผิด', () => {
      fillCredentials('hacker', '0000');
      submitForm();
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('error message หายไปเมื่อ submit ใหม่สำเร็จ', () => {
      // submit ผิดก่อน
      fillCredentials('wronguser', '1234');
      submitForm();
      expect(screen.getByText(/ไม่ถูกต้อง/)).toBeInTheDocument();

      // แก้แล้ว submit ถูก
      fillCredentials('admin', '1234');
      submitForm();
      expect(screen.queryByText(/ไม่ถูกต้อง/)).not.toBeInTheDocument();
    });

  });

  // ── Input onChange ────────────────────────────────────────────────────────

  describe('Input onChange', () => {

    it('อัปเดตค่า username ได้', () => {
      fillCredentials('admin');
      expect(screen.getByPlaceholderText('admin / staff / user').value).toBe('admin');
    });

    it('อัปเดตค่า password ได้', () => {
      fillCredentials('', '1234');
      expect(screen.getByPlaceholderText('••••••••').value).toBe('1234');
    });

  });

});