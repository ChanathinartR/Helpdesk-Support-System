import React from "react";
import { AuthProvider, useAuth } from "./features/auth/context/AuthContext";
import { TicketProvider } from "./store/TicketContext";
import LoginForm from "./features/auth/components/LoginForm";
import MainLayout from "./components/Layout/MainLayout";

function AppContent() {
  const { isAuthenticated } = useAuth();

  // ถ้ายังไม่ Login ให้แสดงหน้า Login
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // ถ้า Login แล้ว ให้เข้าสู่โครงสร้างหลัก
  return <MainLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <AppContent />
      </TicketProvider>
    </AuthProvider>
  );
}