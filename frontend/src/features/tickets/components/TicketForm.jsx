import React, { useState } from 'react';
import { useTickets } from '../../../store/TicketContext';

const TicketForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contact: ''
  });

  const { addTicket } = useTickets();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // เช็คให้ครบทุกช่อง!
    if (!formData.title.trim() || !formData.description.trim() || !formData.contact.trim()) {
      alert("Error: Please fill in all fields.");
      return;
    }

    addTicket(formData);
    alert("Ticket created successfully!");

    // ล้างค่าฟอร์ม
    setFormData({ title: '', description: '', contact: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <header className="mb-4 text-center">
        <h2 className="text-2xl font-bold">Issue Ticket</h2>
      </header>
      <input
        className="w-full p-2 border rounded"
        placeholder="Issue Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />
      <textarea
        className="w-full p-2 border rounded h-24"
        placeholder="Describe your problem..."
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Email / Phone"
        value={formData.contact}
        onChange={(e) => setFormData({...formData, contact: e.target.value})}
      />
      <button type="submit" className="w-full bg-[#eb25b6] text-white py-2 rounded font-bold hover:bg-[#c41d96]">
        Create Ticket
      </button>
    </form>
  );
};

export default TicketForm;