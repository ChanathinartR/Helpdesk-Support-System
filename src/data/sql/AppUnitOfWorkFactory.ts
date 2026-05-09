import { Token } from "@nipacloud/framework/core/ioc";
import { Database } from "@nipacloud/framework/data/sql";
import { IAppUnitOfWork } from "../abstractions/IAppUnitOfWork";
import { IAppUnitOfWorkFactory } from "../abstractions/IAppUnitOfWorkFactory";
import { AppUnitOfWork } from "./AppUnitOfWork";
export class AppSqlUnitOfWorkFactory implements IAppUnitOfWorkFactory {
    create(): IAppUnitOfWork {
        return new AppUnitOfWork(Database.instance);
    }
}
export const AppUnitOfWorkFactory = new Token<IAppUnitOfWorkFactory>("IAppUnitOfWorkFactory");
