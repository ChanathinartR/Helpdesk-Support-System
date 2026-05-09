export interface ITicket {
    id?: string;
    title: string;
    description: string;
    contact: string;
    status: TicketStatus;
    created_at: Date;
    updated_at: Date;
}

export type TicketStatus = "pending" | "accepted" | "resolved" | "rejected";
