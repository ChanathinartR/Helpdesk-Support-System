"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsError = exports.UserNotfoundError = void 0;
const error_1 = require("@nipacloud/framework/core/error");
class UserNotfoundError extends error_1.ApplicationError {
    constructor(message = "user not found.") {
        super(message);
    }
}
exports.UserNotfoundError = UserNotfoundError;
class InvalidCredentialsError extends error_1.ApplicationError {
    constructor(message = "email or password is incorrect.") {
        super(message);
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
//# sourceMappingURL=index.js.map