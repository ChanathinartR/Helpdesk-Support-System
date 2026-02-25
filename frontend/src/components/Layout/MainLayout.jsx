import React, { useState } from "react";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useTickets } from "../../store/TicketContext";
import { getTicketStats } from "../../features/tickets/utils/ticketHelpers";
import TicketForm from "../../features/tickets/components/TicketForm";
import TicketList from "../../features/tickets/components/TicketList";
import TicketHistory from "../../features/tickets/components/TicketHistory";
import Dashboard from "../../features/tickets/components/Dashboard";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const { tickets } = useTickets();
  const [view, setView] = useState("board"); // 'board', 'dashboard', 'history'
  
  const stats = getTicketStats(tickets);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* --- SIDEBAR --- */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col fixed h-full shadow-lg z-10">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#eb25b6] tracking-tighter">HELPDESK</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Management System</p>
          </div>
          <button 
            onClick={logout}
            className="text-[10px] font-bold text-red-400 hover:text-red-600 border border-red-100 px-2 py-1 rounded-lg transition-colors"
          >
            LOG OUT
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          {/* User Profile Summary */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Active Role</p>
            <p className="font-black text-gray-700 uppercase italic">● {user?.role}</p>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block px-2">Main Menu</label>
            <MenuBtn active={view === 'board'} onClick={() => setView('board')} label="Kanban Board" icon="📋" />
            <MenuBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} label="Dashboard" icon="📊" />
            <MenuBtn active={view === 'history'} onClick={() => setView('history')} label="Ticket History" icon="📜" />
          </nav>

          {/* Conditional: Ticket Form for User Role */}
          {user?.role === 'user' && view === 'board' && (
            <div className="pt-6 border-t border-gray-100">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-3 block">Quick Report</label>
              <div className="scale-90 origin-top -mt-2">
                <TicketForm />
              </div>
              <footer className="mt-6 text-center">
                <p className="text-[11px] text-blue-500 font-medium bg-blue-50 py-2 rounded-lg">
                  💡 มีปัญหา? ติดต่อแอดมิน
                </p>
              </footer>
            </div>
          )}

          {user?.role !== 'user' && view === 'board' && (
            <div className="pt-6 border-t border-gray-100">
              <footer className="mt-6 text-center">
                <p className="text-[11px] text-blue-500 font-medium bg-blue-50 py-2 rounded-lg">
                  💡 เคล็ดลับ: ลากและวางตั๋วเพื่ออัปเดตสถานะได้เลย!
                </p>
              </footer>
            </div>
          )}
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-80 p-10">
        {/* Dynamic View Rendering */}
        <div className="max-w-6xl mx-auto">
          {view === "board" && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-8">
                <h2 className="text-3xl font-black text-gray-900">Support Board</h2>
                <p className="text-gray-500">สถานะตั๋ว (แสดงสูงสุด 10 รายการต่อช่อง)</p>
              </header>
              <TicketList role={user?.role} />
            </section>
          )}

          {view === "dashboard" && <Dashboard />}
          
          {view === "history" && <TicketHistory />}
        </div>
      </main>
    </div>
  );
};
// Sidebar
const MenuBtn = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      active 
        ? 'bg-gray-900 text-white shadow-lg transform scale-[1.02]' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <span className="text-lg">{icon}</span>
    {label}
  </button>
);

export default MainLayout;