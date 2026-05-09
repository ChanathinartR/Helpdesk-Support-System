import { IAppUnitOfWork } from "@app/data/abstractions/IAppUnitOfWork";
import { IAppUnitOfWorkFactory } from "@app/data/abstractions/IAppUnitOfWorkFactory";
import { AppUnitOfWorkFactory } from "@app/data/sql/AppUnitOfWorkFactory";
import { using } from "@nipacloud/framework/core/disposable";
import { Inject, Service } from "@nipacloud/framework/core/ioc";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { CreateUserRequest } from "./dto/UserRequest";
import { UserDomainService } from "./UserDomainService";

@Service()
export class UserService {
    @Inject(AppUnitOfWorkFactory)
    private _unitOfWorkFactory!: IAppUnitOfWorkFactory;

    @Inject()
    private _userDomainService!: UserDomainService;

    public async getUserById(id: string) {
        const context = using(this._unitOfWorkFactory.create());
        return context((uow: IAppUnitOfWork) => {
            return this._userDomainService.getUserById(uow, id);
        });
    }

    public async createUser(user: CreateUserRequest) {
        const context = using(this._unitOfWorkFactory.create());
        return context(async (uow: IAppUnitOfWork) => {
            return uow.userRepository.createUser({
                id: randomUUID(),
                email: user.email,
                password: await bcrypt.hash(user.password, 10),
                created_at: new Date(),
                updated_at: new Date(),
                name: user.name,
            });
        });
    }
    public async login(email: string, password: string) {
        const context = using(this._unitOfWorkFactory.create());
        return context(async (uow: IAppUnitOfWork) => {
            return this._userDomainService.login(uow, email, password);
        });
    }
}
