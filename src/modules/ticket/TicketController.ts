import {
    Body,
    Get,
    InternalServerError,
    JsonController,
    NotAcceptableError,
    Param,
    Post,
    Put,
    RequestScopeContainer,
} from "@nipacloud/framework/core/http";
import { ContainerInstance } from "@nipacloud/framework/core/ioc";
import { TicketService } from "./TicketService";
import { CreateTicketRequest, UpdateTicketRequest } from "./dto";
import { TicketAlreadyExistsError } from "./errors";

@JsonController("/hd/tickets")
export class TicketController {
    @Get()
    public async listTicket(@RequestScopeContainer() container: ContainerInstance) {
        try {
            const service = container.get(TicketService);
            const tickets = await service.listTickets();
            return { tickets };
        } catch (error) {
            console.log("[TicketController#listTicket] error ", error);
            throw new InternalServerError("something went wrong, please contact administrator.");
        }
    }

    @Post()
    public async createTicket(
        @Body() body: CreateTicketRequest,
        @RequestScopeContainer() container: ContainerInstance,
    ): Promise<void> {
        try {
            const service = container.get(TicketService);
            await service.createTicket(body);
            return null;
        } catch (error) {
            console.log("[TicketController#createTicket] error ", error);
            if (error instanceof TicketAlreadyExistsError) {
                throw new NotAcceptableError(error.message);
            }
            throw new InternalServerError("something went wrong, please contact administrator.");
        }
    }
    @Put("/:id")
    public async updateTicket(
        @Param("id") id: string,
        @Body() body: UpdateTicketRequest,
        @RequestScopeContainer() container: ContainerInstance,
    ): Promise<void> {
        try {
            const service = container.get(TicketService);
            await service.updateTicket(id, body);
            return null;
        } catch (error) {
            console.log("[TicketController#upadteTicket] error ", error);
            throw new InternalServerError("something went wrong, please contact administrator.");
        }
    }
}
