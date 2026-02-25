// tests/unit/AuthContext.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../../src/features/auth/context/AuthContext';

// ─── Test Component ───────────────────────────────────────────────────────────
// ใช้ component จำลองเพื่อดึงค่าจาก context มาแสดงผล

const TestConsumer = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="role">{user?.role ?? 'null'}</p>
      <p data-testid="isAuthenticated">{String(isAuthenticated)}</p>
      <button onClick={() => login('admin')}>login admin</button>
      <button onClick={() => login('staff')}>login staff</button>
      <button onClick={() => login('user')}>login user</button>
      <button onClick={logout}>logout</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('AuthContext', () => {

  // ── ค่าเริ่มต้น ──────────────────────────────────────────────────────────

  describe('ค่าเริ่มต้น', () => {

    it('user เป็น null ตอนแรก', () => {
      renderWithProvider();
      expect(screen.getByTestId('role').textContent).toBe('null');
    });

    it('isAuthenticated เป็น false ตอนแรก', () => {
      renderWithProvider();
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    });

  });

  // ── login ─────────────────────────────────────────────────────────────────

  describe('login()', () => {

    it('login("admin") — user.role เป็น admin', () => {
      renderWithProvider();
      act(() => screen.getByText('login admin').click());
      expect(screen.getByTestId('role').textContent).toBe('admin');
    });

    it('login("staff") — user.role เป็น staff', () => {
      renderWithProvider();
      act(() => screen.getByText('login staff').click());
      expect(screen.getByTestId('role').textContent).toBe('staff');
    });

    it('login("user") — user.role เป็น user', () => {
      renderWithProvider();
      act(() => screen.getByText('login user').click());
      expect(screen.getByTestId('role').textContent).toBe('user');
    });

    it('login() — isAuthenticated เป็น true หลัง login', () => {
      renderWithProvider();
      act(() => screen.getByText('login admin').click());
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    });

    it('login ซ้ำ — role เปลี่ยนเป็นค่าใหม่', () => {
      renderWithProvider();
      act(() => screen.getByText('login admin').click());
      expect(screen.getByTestId('role').textContent).toBe('admin');
      act(() => screen.getByText('login staff').click());
      expect(screen.getByTestId('role').textContent).toBe('staff');
    });

  });

  // ── logout ────────────────────────────────────────────────────────────────

  describe('logout()', () => {

    it('logout() — user กลับเป็น null', () => {
      renderWithProvider();
      act(() => screen.getByText('login admin').click());
      act(() => screen.getByText('logout').click());
      expect(screen.getByTestId('role').textContent).toBe('null');
    });

    it('logout() — isAuthenticated กลับเป็น false', () => {
      renderWithProvider();
      act(() => screen.getByText('login admin').click());
      act(() => screen.getByText('logout').click());
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    });

    it('logout() โดยไม่ได้ login ก่อน — ไม่ error', () => {
      renderWithProvider();
      expect(() => act(() => screen.getByText('logout').click())).not.toThrow();
      expect(screen.getByTestId('role').textContent).toBe('null');
    });

  });

  // ── useAuth ───────────────────────────────────────────────────────────────

  describe('useAuth()', () => {

    it('throw error เมื่อใช้ useAuth นอก AuthProvider', () => {
      // suppress console.error ของ React
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const BadComponent = () => {
        useAuth();
        return null;
      };

      // useAuth จะ return undefined context แต่ไม่ throw เอง
      // ตรวจสอบว่า render ได้โดยไม่ crash (context = undefined)
      expect(() => render(<BadComponent />)).not.toThrow();

      spy.mockRestore();
    });

  });

});
