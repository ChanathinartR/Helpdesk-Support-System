import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useTickets } from '../../../store/TicketContext';
import { formatDate } from '../utils/ticketHelpers';

const STATUS_OPTIONS = ['pending', 'accepted', 'resolved', 'rejected'];

const TicketCard = ({ ticket, role }) => {
  const { updateTicket } = useTickets();
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // สำหรับ Modal รายละเอียด

  const [editData, setEditData] = useState({
    title: ticket.title,
    description: ticket.description,
    contact: ticket.contact || ticket.contact_info,
    status: ticket.status,
  });

  // ตั้งค่าการลาก (Drag)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id.toString(),
    disabled: role === 'user' || isEditing,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = (e) => {
    e.stopPropagation();
    updateTicket(ticket.id, editData);
    setIsEditing(false);
  };

  // ดึงเวลาอัปเดต (รองรับหลายชื่อตัวแปร)
  const updatedAt = ticket.updated_at || ticket.updatedAt;
  const createdAt = ticket.created_at || ticket.createdAt;
  const isWasUpdated = updatedAt && new Date(updatedAt).getTime() !== new Date(createdAt).getTime();

  // --- MODE: EDITING ---
  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md border border-purple-200" style={style}>
        <input
          className="w-full text-sm font-bold border-b border-gray-200 mb-2 outline-none pb-1"
          value={editData.title}
          onChange={e => setEditData(p => ({ ...p, title: e.target.value }))}
          placeholder="Title"
        />
        <textarea
          className="w-full text-xs text-gray-500 border-b border-gray-200 mb-2 outline-none resize-none pb-1"
          value={editData.description}
          onChange={e => setEditData(p => ({ ...p, description: e.target.value }))}
          rows={2}
          placeholder="Description"
        />
        <input
          className="w-full text-xs border-b border-gray-200 mb-3 outline-none pb-1"
          value={editData.contact}
          onChange={e => setEditData(p => ({ ...p, contact: e.target.value }))}
          placeholder="Contact"
        />
        <select
          className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1 mb-3"
          value={editData.status}
          onChange={e => setEditData(p => ({ ...p, status: e.target.value }))}
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex gap-2">
          <button onClick={handleSave} className="flex-1 bg-purple-600 text-white text-xs py-1.5 rounded-lg font-bold">Save</button>
          <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-gray-500 text-xs py-1.5 rounded-lg font-bold">Cancel</button>
        </div>
      </div>
    );
  }

  // --- MODE: VIEW (NORMAL CARD) ---
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md ${
          role !== 'user' ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            {/* คลิกที่ Title เพื่อเปิด Modal */}
            <h4 
              onPointerDown={(e) => e.stopPropagation()} 
              onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
              className="font-bold text-sm text-gray-800 hover:text-purple-600 cursor-pointer transition-colors decoration-purple-300 hover:underline underline-offset-4"
            >
              {ticket.title}
            </h4>
            
            {role === 'admin' && (
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="text-[12px] hover:scale-125 transition ml-2"
              >
                ✏️
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 line-clamp-2">{ticket.description}</p>

          <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-50">
            <div className="text-[10px] text-gray-400">
              {isWasUpdated ? (
                <span className="text-purple-500 font-bold">{'🔄 อัปเดต:'} <span>{formatDate(updatedAt)}</span></span>
              ) : (
                <span>{'📅 สร้าง:'} <span>{formatDate(createdAt)}</span></span>
              )}
            </div>
            {/* ปุ่มแว่นขยายสำหรับเปิดดูรายละเอียด (กันพลาดกรณีคลิกหัวข้อไม่โดน) */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
              className="text-[10px] bg-gray-50 hover:bg-purple-50 text-purple-600 px-2 py-1 rounded font-bold transition-colors"
            >
              🔍 VIEW
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL POP-UP --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4 border-b pb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{ticket.title}</h2>
                <p className="text-[10px] text-gray-400 mt-1">ID: {ticket.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                ticket.status === 'pending' ? 'bg-pink-100 text-pink-500' : 
                ticket.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 
                ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {ticket.status}
              </span>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">รายละเอียดปัญหา</label>
                <div className="mt-1 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed whitespace-pre-wrap">
                  {ticket.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">ข้อมูลติดต่อ</label>
                  <p className="text-sm text-gray-800 mt-1">{ticket.contact || ticket.contact_info || '-'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">เวลาอัปเดตล่าสุด</label>
                  <p className="text-sm text-gray-800 mt-1">{formatDate(updatedAt || createdAt)}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="mt-8 w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 font-bold transition-all shadow-lg active:scale-95"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketCard;