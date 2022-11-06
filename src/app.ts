import app from ".";
import { CONFIG } from "./config/config";

// ------- 启动服务中心 -------

app.listen(CONFIG.SERVER_PORT, () => {
  console.log("server run in ", CONFIG.SERVER_PORT);
});
