import React from "react";
import { useDroppable } from "@dnd-kit/core";
import TicketCard from "./TicketCard";

const KanbanColumn = ({ status, items, role }) => {
  const { setNodeRef } = useDroppable({ id: status.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl ${status.bgColor} p-3 min-h-[70vh] border-2 border-transparent transition-colors`}
    >

      <div className="flex justify-between items-center mb-4 px-1">

        <h3 className="font-bold text-sm text-gray-700 uppercase">
          {status.label}
        </h3>
        <span className="bg-white px-2 py-0.5 rounded-lg text-xs font-black shadow-sm">
          {items.length}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            role={role}
            isDraggable={true}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
