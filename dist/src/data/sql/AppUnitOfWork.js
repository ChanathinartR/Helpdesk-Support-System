"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUnitOfWork = void 0;
const sql_1 = require("@nipacloud/framework/data/sql");
const repositories_1 = require("./repositories");
class AppUnitOfWork extends sql_1.DatabaseUnitOfWork {
    constructor(connection) {
        super(connection);
        this.ticketRepository = new repositories_1.TicketRepository(this);
        this.userRepository = new repositories_1.UserRepository(this);
    }
}
exports.AppUnitOfWork = AppUnitOfWork;
//# sourceMappingURL=AppUnitOfWork.js.map