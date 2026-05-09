"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketUpdateError = exports.TicketAlreadyExistsError = void 0;
const error_1 = require("@nipacloud/framework/core/error");
class TicketAlreadyExistsError extends error_1.ApplicationError {
    constructor(message = "ticket already exists.") {
        super(message);
    }
}
exports.TicketAlreadyExistsError = TicketAlreadyExistsError;
class TicketUpdateError {
}
exports.TicketUpdateError = TicketUpdateError;
//# sourceMappingURL=index.js.map