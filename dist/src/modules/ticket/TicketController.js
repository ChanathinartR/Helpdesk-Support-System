"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const tslib_1 = require("tslib");
const http_1 = require("@nipacloud/framework/core/http");
const ioc_1 = require("@nipacloud/framework/core/ioc");
const TicketService_1 = require("./TicketService");
const dto_1 = require("./dto");
const errors_1 = require("./errors");
let TicketController = class TicketController {
    async listTicket(container) {
        try {
            const service = container.get(TicketService_1.TicketService);
            const tickets = await service.listTickets();
            return { tickets };
        }
        catch (error) {
            console.log("[TicketController#listTicket] error ", error);
            throw new http_1.InternalServerError("something went wrong, please contact administrator.");
        }
    }
    async createTicket(body, container) {
        try {
            const service = container.get(TicketService_1.TicketService);
            await service.createTicket(body);
            return null;
        }
        catch (error) {
            console.log("[TicketController#createTicket] error ", error);
            if (error instanceof errors_1.TicketAlreadyExistsError) {
                throw new http_1.NotAcceptableError(error.message);
            }
            throw new http_1.InternalServerError("something went wrong, please contact administrator.");
        }
    }
    async updateTicket(id, body, container) {
        try {
            const service = container.get(TicketService_1.TicketService);
            await service.updateTicket(id, body);
            return null;
        }
        catch (error) {
            console.log("[TicketController#upadteTicket] error ", error);
            throw new http_1.InternalServerError("something went wrong, please contact administrator.");
        }
    }
};
exports.TicketController = TicketController;
tslib_1.__decorate([
    (0, http_1.Get)(),
    tslib_1.__param(0, (0, http_1.RequestScopeContainer)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [ioc_1.ContainerInstance]),
    tslib_1.__metadata("design:returntype", Promise)
], TicketController.prototype, "listTicket", null);
tslib_1.__decorate([
    (0, http_1.Post)(),
    tslib_1.__param(0, (0, http_1.Body)()),
    tslib_1.__param(1, (0, http_1.RequestScopeContainer)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateTicketRequest,
        ioc_1.ContainerInstance]),
    tslib_1.__metadata("design:returntype", Promise)
], TicketController.prototype, "createTicket", null);
tslib_1.__decorate([
    (0, http_1.Put)("/:id"),
    tslib_1.__param(0, (0, http_1.Param)("id")),
    tslib_1.__param(1, (0, http_1.Body)()),
    tslib_1.__param(2, (0, http_1.RequestScopeContainer)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateTicketRequest,
        ioc_1.ContainerInstance]),
    tslib_1.__metadata("design:returntype", Promise)
], TicketController.prototype, "updateTicket", null);
exports.TicketController = TicketController = tslib_1.__decorate([
    (0, http_1.JsonController)("/api/tickets")
], TicketController);
//# sourceMappingURL=TicketController.js.map