import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// 1. ขยายความสามารถของ expect ให้ใช้คำสั่งอย่าง .toBeInTheDocument() ได้
expect.extend(matchers);

// 2. ล้างค่า DOM หลังจากจบแต่ละ Test เพื่อไม่ให้ข้อมูลปนกัน
afterEach(() => {
  cleanup();
});

// 3. Mock ฟังก์ชันที่มักจะมีปัญหาในสภาพแวดล้อม Test
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // สำหรับเวอร์ชันเก่า
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});