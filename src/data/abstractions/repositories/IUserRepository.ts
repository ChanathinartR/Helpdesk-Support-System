import { IUser } from "../entities";
export interface IUserRepository {
    createUser(user: IUser): Promise<void>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserById(id: string): Promise<IUser | null>;
    updateUser(id: string, user: Partial<IUser>): Promise<void>;
    getUserByCredentials(email: string, password: string): Promise<IUser>;
}

/*partial :opational สามารถว่างได้
promise ต้องมีawait ไม่งั้นจะรันผ่านไป*/
