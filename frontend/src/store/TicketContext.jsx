import React, { createContext, useState, useContext, useEffect } from 'react';
import { ticketService } from '../features/tickets/services/ticketService';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true); 

    // 1. ดึงข้อมูลตั๋วทั้งหมดเมื่อคอมโพเนนต์โหลด
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await ticketService.getAll();
                setTickets(data);
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    // 2. ฟังก์ชันเพิ่มตั๋ว
    const addTicket = async (formData) => {
        try {
            const newTicket = await ticketService.create(formData);
            setTickets(prev => [newTicket, ...prev]);
        } catch (error) {
            alert("Error creating ticket");
        }
    };

    // 3. ฟังก์ชันอัปเดตข้อมูลตั๋ว (เช่น แก้ไขรายละเอียด)
    const updateTicket = async (id, editData) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tickets/${id}`, {
                method: 'PUT', // ใช้ PUT ตามที่เซ็ตไว้ใน server.js
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });
            const updatedData = await response.json();

            if (response.ok) {
                setTickets(prev => prev.map(t => (t.id === id ? updatedData : t)));//✅ อัปเดตข้อมูลทับตัวเดิม ข้อมูลวันที่อัปเดตจะเปลี่ยนทันที
            } else {
                alert(updatedData.error || "Update failed");
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    // 4. ฟังก์ชันอัปเดตสถานะ (Kanban)
    const updateTicketStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tickets/${id}`, {
                method: 'PATCH',// ใช้ PATCH สำหรับอัปเดตบาง field (status)
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ status: newStatus }) // ส่งเฉพาะ field ที่ต้องการอัปเดต
            });
            const updatedData = await response.json(); 

            if (response.ok) { //.ok คือ status code 200-299 แสดงว่าการอัปเดตสำเร็จ
                setTickets(prev => prev.map(t => t.id === id ? updatedData : t));
            } else {// ถ้าไม่สำเร็จ (เช่น status ไม่ถูกต้อง) แสดง error และดึงข้อมูลใหม่จาก server เพื่อความถูกต้อง
                console.error("Server error:", updatedData.error);
                const freshData = await ticketService.getAll();//
                setTickets(freshData);
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <TicketContext.Provider value={{ 
            tickets, 
            loading, 
            addTicket, 
            updateTicketStatus, 
            updateTicket
        }}>
            {children}
        </TicketContext.Provider>
    );
};

export const useTickets = () => useContext(TicketContext);