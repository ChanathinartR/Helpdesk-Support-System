import { ITicket } from "@app/data/abstractions/entities";
import { IAppUnitOfWork } from "@app/data/abstractions/IAppUnitOfWork";
import { IAppUnitOfWorkFactory } from "@app/data/abstractions/IAppUnitOfWorkFactory";
import { AppUnitOfWorkFactory } from "@app/data/sql/AppUnitOfWorkFactory";
import { using } from "@nipacloud/framework/core/disposable";
import { Inject, Service } from "@nipacloud/framework/core/ioc";
import { ILogger, Logger } from "@nipacloud/framework/core/util/log";
import { CreateTicketRequest, UpdateTicketRequest } from "./dto/TicketRequest";
import { TicketAlreadyExistsError } from "./errors";

@Service()
export class TicketService {
    @Inject(AppUnitOfWorkFactory)
    private _unitOfWorkFactory: IAppUnitOfWorkFactory;

    @Inject(Logger)
    private _logger: ILogger;
    public async listTickets(): Promise<ITicket[]> {
        const context = using(this._unitOfWorkFactory.create());
        return context((uow: IAppUnitOfWork) => {
            return uow.ticketRepository.list();
        });
    }

    public async createTicket(req: CreateTicketRequest): Promise<void> {
        const context = using(this._unitOfWorkFactory.create());
        return context(async (uow: IAppUnitOfWork) => {
            await uow.initialize({});
            const existingTicket = await uow.ticketRepository.findByTitle(req.title);
            if (existingTicket) {
                this._logger.warn(`[TicketService#createTicket] ticket with title ${req.title} already exists.`);
                throw new TicketAlreadyExistsError();
            }

            const ticket = uow.ticketRepository.create({
                title: req.title,
                description: req.description,
                contact: req.contact,
            });
            await uow.saveChanges();
            return ticket;
        });
    }

    public async updateTicket(id: string, req: UpdateTicketRequest): Promise<void> {
        const context = using(this._unitOfWorkFactory.create());
        return context(async (uow: IAppUnitOfWork) => {
            await uow.initialize({});
            const updatedTicket = await uow.ticketRepository.updateById(id, req);
            await uow.saveChanges();
        });
    }
}
