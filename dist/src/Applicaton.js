"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainApplication = void 0;
const tslib_1 = require("tslib");
const application_1 = require("@nipacloud/framework/core/application");
const http_1 = require("@nipacloud/framework/core/http");
const TicketController_1 = require("@app/modules/ticket/TicketController");
const ioc_1 = require("@nipacloud/framework/core/ioc");
const log_1 = require("@nipacloud/framework/core/util/log");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const AppUnitOfWorkFactory_1 = require("./data/sql/AppUnitOfWorkFactory");
const middlewares_1 = require("./middlewares");
const AuthChecker_1 = require("./modules/authorization/AuthChecker");
const UserController_1 = require("./modules/user/UserController");
dotenv_1.default.config();
class MainApplication extends application_1.Application {
    constructor() {
        super();
        this._httpApplication = new http_1.HttpServer();
        this._httpApplication
            .useMiddleware(http_1.RequestIdGeneratorMiddleware)
            .useMiddleware(http_1.RequestContainerLifeCycleMiddleware)
            .useMiddleware(log_1.LoggerRequestScopeLoaderMiddleware)
            .useMiddleware(middlewares_1.RequestScopeContainerMiddleware)
            .useMiddleware(http_1.RequestLoggerMiddleware)
            .useMiddleware(http_1.ErrorResponderMiddleware)
            .withAuthorizationChecker(AuthChecker_1.checkUserAuthorization)
            .withCurrentUserChecker(AuthChecker_1.getCurrentUser)
            .useController(TicketController_1.TicketController)
            .useController(UserController_1.UserController);
    }
    async beforeApplicationStart() {
        ioc_1.Container.set(AppUnitOfWorkFactory_1.AppUnitOfWorkFactory, new AppUnitOfWorkFactory_1.AppSqlUnitOfWorkFactory());
    }
    async start() {
        return this._httpApplication.start(parseInt(process.env.PORT || "3000"));
    }
}
exports.MainApplication = MainApplication;
//# sourceMappingURL=Applicaton.js.map