"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUnitOfWorkFactory = exports.AppSqlUnitOfWorkFactory = void 0;
const ioc_1 = require("@nipacloud/framework/core/ioc");
const sql_1 = require("@nipacloud/framework/data/sql");
const AppUnitOfWork_1 = require("./AppUnitOfWork");
class AppSqlUnitOfWorkFactory {
    create() {
        return new AppUnitOfWork_1.AppUnitOfWork(sql_1.Database.instance);
    }
}
exports.AppSqlUnitOfWorkFactory = AppSqlUnitOfWorkFactory;
exports.AppUnitOfWorkFactory = new ioc_1.Token("IAppUnitOfWorkFactory");
//# sourceMappingURL=AppUnitOfWorkFactory.js.map