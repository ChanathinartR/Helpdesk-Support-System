import { IAppUnitOfWork } from "./IAppUnitOfWork";

export interface IAppUnitOfWorkFactory {
    create(): IAppUnitOfWork;
}
