import { Action } from "@nipacloud/framework/core/http";
import { Container } from "@nipacloud/framework/core/ioc";
import jwt from "jsonwebtoken";
import { IUser } from "../../data/abstractions/entities";
import { AppUnitOfWorkFactory } from "../../data/sql/AppUnitOfWorkFactory";
import { UserDomainService } from "../user/UserDomainService";
import { UserNotfoundError } from "../user/error";

export async function checkUserAuthorization(action: Action): Promise<boolean> {
    const token = action.request.header["x-auth-token"];
    if (!token) {
        return false;
    }
    try {
        const userDetail = jwt.verify(token, process.env.JWT_SECRET || "secret") as IUser;
        const uow = Container.get(AppUnitOfWorkFactory).create();
        const service = Container.get(UserDomainService);
        const user = await service.getUserById(uow, userDetail.id);
        action.request.user = user;
        return true;
    } catch (error: any) {
        if (error instanceof UserNotfoundError) {
            console.log("Authchecker:user not found");
        } else {
            console.log("Authchecker:invalid token");
        }
    }
}

export function getCurrentUser(action: Action): Promise<IUser | null> {
    return action.request.user || null;
}
