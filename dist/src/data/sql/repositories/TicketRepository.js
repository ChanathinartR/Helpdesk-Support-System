"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRepository = void 0;
const sql_1 = require("@nipacloud/framework/data/sql");
class TicketRepository extends sql_1.DatabaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = "tickets";
    }
    async create(ticket) {
        await this.add(ticket);
    }
    async list() {
        return this.find((q) => q);
    }
    async findByTitle(title) {
        return this.first((q) => q.where("title", title));
    }
    async findById(id) {
        return this.first((q) => q.where("id", id));
    }
    async sortByStatus(status) {
        return this.find((q) => q.where("status", status));
    }
    async updateById(id, ticket) {
        await this.update(ticket, (q) => q.where("id", id));
    }
    async updateStatusById(id, status) {
        await this.update({ status }, (q) => q.where("id", id));
    }
    async sortByCreatedAt(order) {
        return this.find((q) => q.orderBy("created_at", order));
    }
}
exports.TicketRepository = TicketRepository;
//# sourceMappingURL=TicketRepository.js.map