"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTicketRequest = exports.CreateTicketRequest = void 0;
const tslib_1 = require("tslib");
const validator_1 = require("@nipacloud/framework/core/util/validator");
class CreateTicketRequest {
}
exports.CreateTicketRequest = CreateTicketRequest;
tslib_1.__decorate([
    (0, validator_1.IsString)(),
    (0, validator_1.MinLength)(4),
    (0, validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateTicketRequest.prototype, "title", void 0);
tslib_1.__decorate([
    (0, validator_1.IsString)(),
    (0, validator_1.MinLength)(4),
    (0, validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateTicketRequest.prototype, "description", void 0);
tslib_1.__decorate([
    (0, validator_1.IsString)(),
    (0, validator_1.MinLength)(10),
    (0, validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateTicketRequest.prototype, "contact", void 0);
class UpdateTicketRequest {
}
exports.UpdateTicketRequest = UpdateTicketRequest;
tslib_1.__decorate([
    (0, validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTicketRequest.prototype, "id", void 0);
tslib_1.__decorate([
    (0, validator_1.IsString)(),
    (0, validator_1.MinLength)(4),
    (0, validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdateTicketRequest.prototype, "title", void 0);
tslib_1.__decorate([
    (0, validator_1.IsString)(),
    (0, validator_1.MinLength)(4),
    (0, validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdateTicketRequest.prototype, "description", void 0);
tslib_1.__decorate([
    (0, validator_1.IsString)(),
    (0, validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdateTicketRequest.prototype, "contact", void 0);
tslib_1.__decorate([
    (0, validator_1.IsOptional)(),
    (0, validator_1.IsIn)(["pending", "accepted", "resolved", "rejected"]),
    tslib_1.__metadata("design:type", String)
], UpdateTicketRequest.prototype, "status", void 0);
//# sourceMappingURL=TicketRequest.js.map