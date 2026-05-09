import { ITicket } from "../entities";

export interface ITicketRepository {
    create(ticket: { title: string; description: string; contact: string }): Promise<void>;
    list(): Promise<ITicket[]>;
    findById(id: string): Promise<ITicket | null>;
    updateById(id: string, ticket: Partial<ITicket>): Promise<void>;
    sortByStatus(status: string): Promise<ITicket[] | null>;
    updateStatusById(id: string, status: string): Promise<void>;
    sortByCreatedAt(order: "asc" | "desc"): Promise<ITicket[]>;
    findByTitle(title: string): Promise<ITicket | null>;
}

/*method(): returnType;
 promise เพื่อบอกว่า method นี้เป็น asynchronous และจะคืนค่าในอนาคต (future) โดยใช้ Promise ในการจัดการกับค่าที่จะถูกส่งกลับมาเมื่อการทำงานเสร็จสิ้น
*/
