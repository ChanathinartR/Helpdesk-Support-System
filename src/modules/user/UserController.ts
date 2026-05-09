import { IUser } from "@app/data/abstractions/entities";
import {
    Authorized,
    Body,
    CurrentUser,
    Get,
    InternalServerError,
    JsonController,
    NotFoundError,
    Param,
    Post,
    RequestScopeContainer,
    UnauthorizedError,
} from "@nipacloud/framework/core/http";
import { ContainerInstance } from "@nipacloud/framework/core/ioc";
import { UserService } from "./UserService";
import { CreateUserRequest, LoginRequest } from "./dto/UserRequest";
import { InvalidCredentialsError, UserNotfoundError } from "./error";

@JsonController("/hd/users")
export class UserController {
    @Get("/:id")
    @Authorized()
    public async getUserDetails(
        @RequestScopeContainer() container: ContainerInstance,
        @Param("id") id: string,
        @CurrentUser() user: IUser,
    ) {
        try {
            const userService = container.get(UserService);
            return userService.getUserById(id);
        } catch (error) {
            console.log("UserController:getUserdetails error", error);
            if (error instanceof UserNotfoundError) {
                throw new NotFoundError(error.message);
            }
            throw new InternalServerError("something went wrong, please contact administrator.");
        }
    }

    @Post()
    public async createUser(@RequestScopeContainer() container: ContainerInstance, @Body() body: CreateUserRequest) {
        try {
            const userService = container.get(UserService);
            await userService.createUser(body);
        } catch (error) {
            console.log("UserController:createUser error", error);
            throw new InternalServerError("something went wrong, please contact administrator.");
        }
    }

    @Post("/login")
    public async login(@RequestScopeContainer() container: ContainerInstance, @Body() body: LoginRequest) {
        try {
            const userService = container.get(UserService);
            return userService.login(body.email, body.password);
        } catch (error) {
            console.log("UserController:login error", error);
            if (error instanceof InvalidCredentialsError) {
                throw new UnauthorizedError(error.message);
            }
            throw new InternalServerError("something went wrong, please contact administrator.");
        }
    }
}
