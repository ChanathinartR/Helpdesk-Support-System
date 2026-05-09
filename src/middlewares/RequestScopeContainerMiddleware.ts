import { Context, Middleware, MiddlewareExecutor } from "@nipacloud/framework/core/http";
import { Container } from "@nipacloud/framework/core/ioc";
import { AppUnitOfWorkFactory } from "../data/sql/AppUnitOfWorkFactory";

@Middleware({ type: "before" })
export class RequestScopeContainerMiddleware {
    public async use(context: Context, next: MiddlewareExecutor) {
        const container = Container.of(context.state.requestScopeContainerId);
        container.set(AppUnitOfWorkFactory, Container.get(AppUnitOfWorkFactory));
        await next();
    }
}

/*@(decorator=functionพิเศษ) แปะบนclass,method เพื่อแก้ไขพฤติกรรมหรือเพิ่ม Metadata (ข้อมูลเสริม)
type: "before": บอกให้ระบบรู้ว่า Middleware ตัวนี้ต้องทำงาน "ก่อน" ที่จะเข้าไปถึง Action หรือ Controller หลัก (มักใช้กับการตรวจสอบ Token, Logging, หรือ Parsing ข้อมูล)*/
