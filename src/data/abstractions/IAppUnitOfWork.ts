import { IUnitOfWork } from "@nipacloud/framework/data/patterns";
import { ITicketRepository, IUserRepository } from "./repositories";

export interface IAppUnitOfWork extends IUnitOfWork {
    ticketRepository: ITicketRepository;
    userRepository: IUserRepository;
}
