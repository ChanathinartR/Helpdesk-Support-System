// src/features/tickets/components/TicketHistory.jsx
import React, { useState } from 'react';
import { useTickets } from '../../../store/TicketContext';
import { filterTickets, sortTickets, formatDate } from '../utils/ticketHelpers';

const TicketHistory = () => {
  const { tickets } = useTickets();
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // ✅ เรียกใช้ฟังก์ชันจาก utils
  const filtered = filterTickets(tickets, { status });
  const processedData = sortTickets(filtered, sortBy);

  // ฟังก์ชันช่วยจัดการสีของ Badge สถานะ
  const getStatusStyle = (s) => {
    switch (s) {
      case 'pending': return 'bg-pink-100 text-pink-600 border border-pink-200';
      case 'accepted': return 'bg-blue-100 text-blue-600 border border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-600 border border-green-200';
      case 'rejected': return 'bg-red-100 text-red-600 border border-red-200';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900">History</h2>
          <p className="text-sm text-gray-500">เรียกดูและตรวจสอบประวัติตั๋วทั้งหมดในระบบ</p>
        </div>
        
        <div className="flex gap-3">
          {/* ตัวกรองสถานะ */}
          <select 
            onChange={(e) => setStatus(e.target.value)} 
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* ตัวเรียงลำดับ */}
          <select 
            onChange={(e) => setSortBy(e.target.value)} 
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white font-bold text-purple-600 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
          >
            <option value="latest">📅 Latest Updated</option>
            <option value="earliest">📅 Earliest</option>
            <option value="status-az">🔤 Status (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">ID / Date</th>
              <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Title / Description</th>
              <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {processedData.length > 0 ? (
              processedData.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      #{String(t.id).slice(-4)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {formatDate(t.created_at)} 
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{t.title}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{t.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusStyle(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">{t.contact}</span>
                      {t.updated_at && (
                        <span className="text-[9px] text-gray-300 italic">
                          Last update: {formatDate(t.updated_at)}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center text-gray-400 italic">
                  <div className="flex flex-col items-center gap-2">
                    <p>No tickets found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketHistory;