import {
  IMiddleware,
  Middleware,
  HeaderParams,
  Next,
  TNext,
  Response,
  TResponse,
} from "lenneth-v2";
import { PG_CONTEXT } from "../config/pgSequelizeConfig";
// import { PG_CONTEXT } from "../config/pgSequelizeConfig";

// @Middleware()
export class HeaderInterceptor {
  async use(@HeaderParams() header: any, @Next() next: TNext) {
    // console.log("/HeaderInterceptor: ", header);
    console.log("/HeaderInterceptor: ");
    await next();
  }
}

// @Middleware()
export class Interceptor implements IMiddleware {
  async use(@HeaderParams() header: any, @Next() next: TNext) {
    console.log("/Interceptor: ");
    await next();
  }
}

// @Middleware()
// class PgConfiguration {
//   async use() {
//     const a = PG_CONTEXT;
//     console.log("/PgConfiguration: ", a.getSequelize());
//   }
// }
