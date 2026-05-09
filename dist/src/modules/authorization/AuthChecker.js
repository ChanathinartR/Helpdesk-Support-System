"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserAuthorization = checkUserAuthorization;
exports.getCurrentUser = getCurrentUser;
const tslib_1 = require("tslib");
const ioc_1 = require("@nipacloud/framework/core/ioc");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const AppUnitOfWorkFactory_1 = require("../../data/sql/AppUnitOfWorkFactory");
const UserDomainService_1 = require("../user/UserDomainService");
const error_1 = require("../user/error");
async function checkUserAuthorization(action) {
    const token = action.request.header["x-auth-token"];
    if (!token) {
        return false;
    }
    try {
        const userDetail = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        const uow = ioc_1.Container.get(AppUnitOfWorkFactory_1.AppUnitOfWorkFactory).create();
        const service = ioc_1.Container.get(UserDomainService_1.UserDomainService);
        const user = await service.getUserById(uow, userDetail.id);
        action.request.user = user;
        return true;
    }
    catch (error) {
        if (error instanceof error_1.UserNotfoundError) {
            console.log("Authchecker:user not found");
        }
        else {
            console.log("Authchecker:invalid token");
        }
    }
}
function getCurrentUser(action) {
    return action.request.user || null;
}
//# sourceMappingURL=AuthChecker.js.map