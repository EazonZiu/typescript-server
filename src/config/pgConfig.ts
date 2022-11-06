// ----- pg connection file -----

import { Config, CONFIG } from "./config";
import pg from "pg";

// 创建pg连接池
const pgPool = new pg.Pool(CONFIG.PG);
// 创建pg客户端
const pgClient = new pg.Client(Config.PG_URL);
// 监听connect事件
pgPool
  .on("connect", () => {
    console.log("pg connection success");
  })
  .on("error", (err) => {
    console.log("pg connection error: " + err);
  })
  .on("remove", () => {
    console.log("pg remove");
  });

export default { pgPool, pgClient };
