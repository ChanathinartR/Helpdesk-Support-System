import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tickets'; // URL ของ Backend คุณ

export const ticketService = {
    // ดึงข้อมูลทั้งหมด
    getAll: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    // สร้างตั๋วใหม่
    create: async (ticketData) => {
        const response = await axios.post(API_URL, ticketData);
        return response.data;
    },
    // อัปเดตสถานะหรือข้อมูล
    update: async (id, updatedData) => {
        const response = await axios.put(`${API_URL}/${id}`, updatedData);
        return response.data;
    },
    // ลบตั๋ว
    delete: async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    }
};