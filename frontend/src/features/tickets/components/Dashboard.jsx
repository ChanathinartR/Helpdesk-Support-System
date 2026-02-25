import React from 'react';
import { useTickets } from '../../../store/TicketContext';
import { getTicketStats } from '../utils/ticketHelpers';

const Dashboard = () => {
  const { tickets } = useTickets();
  const stats = getTicketStats(tickets);

  // คำนวณเปอร์เซ็นต์ความสำเร็จ
  const successRate = stats.total > 0 
    ? Math.round((stats.resolved / stats.total) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-black text-gray-900">System Overview</h2>
        <p className="text-gray-500">วิเคราะห์ข้อมูลและสถิติการจัดการตั๋วทั้งหมดในระบบ</p>
      </div>

      {/* สถิติแบบการ์ดตัวเลข */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Tickets" value={stats.total} color="bg-gray-900" />
        <StatCard label="Success Rate" value={`${successRate}%`} color="bg-green-600" />
        <StatCard label="Pending/Accepted" value={stats.pending + stats.accepted} color="bg-blue-600" />
        <StatCard label="Rejected" value={stats.rejected} color="bg-red-600" />
      </div>

      {/* กราฟแท่งแนวนอน (Simple Bar) */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
          📊 Ticket Status Distribution
        </h3>
        <div className="space-y-5">
          <StatusRow label="Pending" count={stats.pending} total={stats.total} color="bg-pink-500" />
          <StatusRow label="Accepted" count={stats.accepted} total={stats.total} color="bg-blue-500" />
          <StatusRow label="Resolved" count={stats.resolved} total={stats.total} color="bg-green-500" />
          <StatusRow label="Rejected" count={stats.rejected} total={stats.total} color="bg-red-500" />
        </div>
      </div>
    </div>
  );
};

// UI Components ย่อยภายใน Dashboard
const StatCard = ({ label, value, color }) => (
  <div className={`${color} p-6 rounded-3xl text-white shadow-lg transform hover:scale-105 transition-transform`}>
    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-4xl font-black">{value}</p>
  </div>
);

const StatusRow = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-gray-500 uppercase">{label}</span>
        <span className="text-gray-900">{count} ตั๋ว ({Math.round(percentage)}%)</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Dashboard;