import { ApplicationError } from "@nipacloud/framework/core/error";
export class TicketAlreadyExistsError extends ApplicationError {
    constructor(message: string = "ticket already exists.") {
        super(message);
    }
}
export class TicketUpdateError {}
