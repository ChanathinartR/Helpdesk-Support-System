import { Database, DatabaseUnitOfWork } from "@nipacloud/framework/data/sql";
import { IAppUnitOfWork } from "../abstractions/IAppUnitOfWork";
import { ITicketRepository, IUserRepository } from "../abstractions/repositories";
import { TicketRepository, UserRepository } from "./repositories";
export class AppUnitOfWork extends DatabaseUnitOfWork implements IAppUnitOfWork {
    readonly ticketRepository: ITicketRepository;
    readonly userRepository: IUserRepository;
    constructor(connection: Database) {
        super(connection);
        this.ticketRepository = new TicketRepository(this);
        this.userRepository = new UserRepository(this);
    }
}
