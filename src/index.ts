import { LennethApplication, ServerSettings, ILenneth } from "lenneth-v2";
import { CONFIG } from "./config/config";
import { PG_CONTEXT } from "./config/pgSequelizeConfig";
import { UserController } from "./controller/userController";
import {
  HeaderInterceptor,
  Interceptor,
  // PgConfiguration,
} from "./middle/indexRoute";

// ------- 注册app中心 -------

@ServerSettings({
  // port
  port: CONFIG.SERVER_PORT,
  // 环境变量
  // env: "prod",
  // controller
  imports: {
    // todo imports 存在问题
    api: UserController,
  },
  // 配置类
  // configurations: [PgConfiguration],
  // 拦截器
  interceptors: [HeaderInterceptor],
  // 返回值封装, 默认开启LennethResponse
  // response: ,
  // error事件捕获
  // globalError ,
})
class App extends LennethApplication implements ILenneth {
  // 预留方法
  $onInit(): void | Promise<any> {}
  $onMountingMiddlewares() {}
  $beforeRoutesInit() {}
  $onRoutesInit() {}
  $afterRoutesInit() {}
  $onReady() {}
  $onServerInitError(error: any) {}
}
PG_CONTEXT;
export default App;
