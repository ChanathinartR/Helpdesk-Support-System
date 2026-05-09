"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const sql_1 = require("@nipacloud/framework/data/sql");
class UserRepository extends sql_1.DatabaseRepository {
    constructor() {
        super(...arguments);
        this.tableName = "users";
    }
    createUser(user) {
        return this.add(user);
    }
    getUserByEmail(email) {
        return this.first((q) => q.where("email", email));
    }
    getUserById(id) {
        return this.first((q) => q.where("id", id));
    }
    updateUser(id, user) {
        return this.update(user, (q) => q.where("id", id));
    }
    getUserByCredentials(email, password) {
        return this.first((q) => q.where("email", email).where("password", password));
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map