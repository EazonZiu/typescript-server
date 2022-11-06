import express from "express";
import indexRoute from "./route";
import parmsFilter from "./middle/filterRoute";
import { postForm, postBody } from "./middle/postRoute";
import pgRoute from "./middle/pgRoute";
import userRoute from "./route/user";

// ------- 注册app中心 -------

// 创建服务器
const app = express();
// 中间件
app.use(postForm); // 注册post=> req.body 插件
app.use(postBody); // 注册post=> req.body 插件
app.use(parmsFilter); // 注册过滤器
app.use(pgRoute); // pg注册器

// 路由中间件
app.use("/index", indexRoute);
app.use("/user", userRoute);

export default app;
