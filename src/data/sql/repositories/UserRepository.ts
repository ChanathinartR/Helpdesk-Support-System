import { DatabaseRepository } from "@nipacloud/framework/data/sql";
import { IUser } from "../../abstractions/entities";
import { IUserRepository } from "../../abstractions/repositories";
export class UserRepository extends DatabaseRepository<IUser> implements IUserRepository {
    protected tableName: string = "users";
    createUser(user: IUser): Promise<void> {
        return this.add(user);
    }
    getUserByEmail(email: string): Promise<IUser | null> {
        return this.first((q) => q.where("email", email));
    }
    getUserById(id: string): Promise<IUser | null> {
        return this.first((q) => q.where("id", id));
    }
    updateUser(id: string, user: Partial<IUser>): Promise<void> {
        return this.update(user, (q) => q.where("id", id));
    }
    getUserByCredentials(email: string, password: string): Promise<IUser> {
        return this.first((q) => q.where("email", email).where("password", password));
    }
}
