import { Application } from "@nipacloud/framework/core/application";
import {
    ErrorResponderMiddleware,
    HttpServer,
    RequestContainerLifeCycleMiddleware,
    RequestIdGeneratorMiddleware,
    RequestLoggerMiddleware,
} from "@nipacloud/framework/core/http";

import { TicketController } from "@app/modules/ticket/TicketController";
import { Container } from "@nipacloud/framework/core/ioc";
import { LoggerRequestScopeLoaderMiddleware } from "@nipacloud/framework/core/util/log";
import DotEnv from "dotenv";
import { AppSqlUnitOfWorkFactory, AppUnitOfWorkFactory } from "./data/sql/AppUnitOfWorkFactory";
import { RequestScopeContainerMiddleware } from "./middlewares";
import { checkUserAuthorization, getCurrentUser } from "./modules/authorization/AuthChecker";
import { UserController } from "./modules/user/UserController";

DotEnv.config();

export class MainApplication extends Application {
    private _httpApplication: HttpServer;

    constructor() {
        super();
        this._httpApplication = new HttpServer();

        this._httpApplication
            .useMiddleware(RequestIdGeneratorMiddleware)
            .useMiddleware(RequestContainerLifeCycleMiddleware)
            .useMiddleware(LoggerRequestScopeLoaderMiddleware)
            .useMiddleware(RequestScopeContainerMiddleware)
            .useMiddleware(RequestLoggerMiddleware)
            .useMiddleware(ErrorResponderMiddleware)
            .withAuthorizationChecker(checkUserAuthorization)
            .withCurrentUserChecker(getCurrentUser)

            .useController(TicketController)
            .useController(UserController);
    }

    async beforeApplicationStart(): Promise<void> {
        Container.set(AppUnitOfWorkFactory, new AppSqlUnitOfWorkFactory());
    }

    async start(): Promise<void> {
        return this._httpApplication.start(parseInt(process.env.PORT || "3000"));
    }
}
