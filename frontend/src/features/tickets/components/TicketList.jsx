import React from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { useTickets } from '../../../store/TicketContext';
import KanbanColumn from './KanbanColumn';
import { sortTickets } from '../utils/ticketHelpers';

const TicketList = ({ role }) => {
  const { tickets, updateTicketStatus } = useTickets();
  const safeItems = Array.isArray(tickets) ? tickets : [];

  const statuses = [
    { id: 'pending', label: 'Pending', color: 'bg-pink-500', bgColor: 'bg-pink-50' },
    { id: 'accepted', label: 'Accepted', color: 'bg-blue-500', bgColor: 'bg-blue-50' },
    { id: 'resolved', label: 'Resolved', color: 'bg-green-500', bgColor: 'bg-green-50' },
    { id: 'rejected', label: 'Rejected', color: 'bg-red-500', bgColor: 'bg-red-50' },
  ];

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ticketId = active.id;
    const newStatus = over.id; 

    const currentTicket = safeItems.find(t => t.id.toString() === ticketId.toString());
    
    if (currentTicket && currentTicket.status !== newStatus) {
      updateTicketStatus(ticketId, newStatus);
    }
  };

  return (
    <DndContext 
      collisionDetection={closestCorners} 
      onDragEnd={role === 'staff' || role === 'admin' ? handleDragEnd : null}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full items-start">
        {statuses.map((status) => {
          const filteredByCol = safeItems.filter(t => t.status === status.id);
          const columnItems = sortTickets(filteredByCol, 'latest').slice(0, 10);

          return (
            <KanbanColumn 
              key={status.id} 
              status={status} 
              items={columnItems} 
              role={role} 
            />
          );
        })}
      </div>
    </DndContext>
  );
};

export default TicketList;