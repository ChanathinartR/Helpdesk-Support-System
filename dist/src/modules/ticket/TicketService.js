"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const tslib_1 = require("tslib");
const AppUnitOfWorkFactory_1 = require("@app/data/sql/AppUnitOfWorkFactory");
const disposable_1 = require("@nipacloud/framework/core/disposable");
const ioc_1 = require("@nipacloud/framework/core/ioc");
const log_1 = require("@nipacloud/framework/core/util/log");
const errors_1 = require("./errors");
let TicketService = class TicketService {
    async listTickets() {
        const context = (0, disposable_1.using)(this._unitOfWorkFactory.create());
        return context((uow) => {
            return uow.ticketRepository.list();
        });
    }
    async createTicket(req) {
        const context = (0, disposable_1.using)(this._unitOfWorkFactory.create());
        return context(async (uow) => {
            await uow.initialize({});
            const existingTicket = await uow.ticketRepository.findByTitle(req.title);
            if (existingTicket) {
                this._logger.warn(`[TicketService#createTicket] ticket with title ${req.title} already exists.`);
                throw new errors_1.TicketAlreadyExistsError();
            }
            const ticket = uow.ticketRepository.create({
                title: req.title,
                description: req.description,
                contact: req.contact,
            });
            await uow.saveChanges();
            return ticket;
        });
    }
    async updateTicket(id, req) {
        const context = (0, disposable_1.using)(this._unitOfWorkFactory.create());
        return context(async (uow) => {
            await uow.initialize({});
            const updatedTicket = await uow.ticketRepository.updateById(id, req);
            await uow.saveChanges();
        });
    }
};
exports.TicketService = TicketService;
tslib_1.__decorate([
    (0, ioc_1.Inject)(AppUnitOfWorkFactory_1.AppUnitOfWorkFactory),
    tslib_1.__metadata("design:type", Object)
], TicketService.prototype, "_unitOfWorkFactory", void 0);
tslib_1.__decorate([
    (0, ioc_1.Inject)(log_1.Logger),
    tslib_1.__metadata("design:type", Object)
], TicketService.prototype, "_logger", void 0);
exports.TicketService = TicketService = tslib_1.__decorate([
    (0, ioc_1.Service)()
], TicketService);
//# sourceMappingURL=TicketService.js.map