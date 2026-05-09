import { DatabaseRepository } from "@nipacloud/framework/data/sql";
import { ITicket } from "../../abstractions/entities";
import { ITicketRepository } from "../../abstractions/repositories";

export class TicketRepository extends DatabaseRepository<ITicket> implements ITicketRepository {
    async create(ticket: { title: string; description: string; contact: string }): Promise<void> {
        await this.add(ticket as ITicket);
    }
    protected tableName: string = "tickets";
    async list(): Promise<ITicket[]> {
        return this.find((q) => q);
    }
    async findByTitle(title: string): Promise<ITicket | null> {
        return this.first((q) => q.where("title", title));
    }
    async findById(id: string): Promise<ITicket | null> {
        return this.first((q) => q.where("id", id));
    }
    async sortByStatus(status: string): Promise<ITicket[] | null> {
        return this.find((q) => q.where("status", status));
    }
    async updateById(id: string, ticket: ITicket): Promise<void> {
        await this.update(ticket, (q) => q.where("id", id));
    }
    async updateStatusById(id: string, status: string): Promise<void> {
        await this.update({ status } as Partial<ITicket>, (q) => q.where("id", id));
    }
    async sortByCreatedAt(order: string): Promise<ITicket[]> {
        return this.find((q) => q.orderBy("created_at", order));
    }
}
