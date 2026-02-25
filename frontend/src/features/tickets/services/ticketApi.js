import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const ticketApi = {
    // ดึงตั๋วทั้งหมด
    fetchTickets: () => 
        axios.get(`${API_BASE_URL}/tickets`),

    // ✅ สร้างตั๋ว - ต้องส่งครบทุก field
    createTicket: (data) => {
        const payload = {
            title: data.title?.trim(),
            description: data.description?.trim(),
            contact: data.contact?.trim(), // ✅ ชื่อต้องตรง
        };
        console.log('📤 Create Payload:', payload);
        return axios.post(`${API_BASE_URL}/tickets`, payload);
    },

    // ✅ อัปเดตสถานะ (Kanban)
    updateStatus: (id, status) =>
        axios.patch(`${API_BASE_URL}/tickets/${id}`, { status }),

    // ✅ อัปเดตข้อมูลทั้งหมด
    updateTicket: (id, data) => {
        const payload = {
            title: data.title?.trim(),
            description: data.description?.trim(),
            contact: data.contact?.trim(),
            status: data.status,
        };
        console.log('📤 Update Payload:', payload);
        return axios.put(`${API_BASE_URL}/tickets/${id}`, payload);
    },
};

export default ticketApi;