"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestScopeContainerMiddleware = void 0;
const tslib_1 = require("tslib");
const http_1 = require("@nipacloud/framework/core/http");
const ioc_1 = require("@nipacloud/framework/core/ioc");
const AppUnitOfWorkFactory_1 = require("../data/sql/AppUnitOfWorkFactory");
let RequestScopeContainerMiddleware = class RequestScopeContainerMiddleware {
    async use(context, next) {
        const container = ioc_1.Container.of(context.state.requestScopeContainerId);
        container.set(AppUnitOfWorkFactory_1.AppUnitOfWorkFactory, ioc_1.Container.get(AppUnitOfWorkFactory_1.AppUnitOfWorkFactory));
        await next();
    }
};
exports.RequestScopeContainerMiddleware = RequestScopeContainerMiddleware;
exports.RequestScopeContainerMiddleware = RequestScopeContainerMiddleware = tslib_1.__decorate([
    (0, http_1.Middleware)({ type: "before" })
], RequestScopeContainerMiddleware);
//# sourceMappingURL=RequestScopeContainerMiddleware.js.map