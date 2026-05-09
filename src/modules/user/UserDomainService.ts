import { IAppUnitOfWork } from "@app/data/abstractions/IAppUnitOfWork";

export class UserDomainService {
    login(uow: IAppUnitOfWork, email: string, password: string): any {
        throw new Error("Method not implemented.");
    }
    getUserById(uow: IAppUnitOfWork, id: string) {
        throw new Error("Method not implemented.");
    }
}
