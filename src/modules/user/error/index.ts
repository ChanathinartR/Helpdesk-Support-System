import { ApplicationError } from "@nipacloud/framework/core/error";

export class UserNotfoundError extends ApplicationError {
    constructor(message: string = "user not found.") {
        super(message);
    }
}

export class InvalidCredentialsError extends ApplicationError {
    constructor(message: string = "email or password is incorrect.") {
        super(message);
    }
}
