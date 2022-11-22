import App from ".";

// ------- 启动服务中心 -------

const app = new App();
// app.$onRoutesInit = () => {
//   const a = PG_CONTEXT;
//   console.log("PG_CONTEXT: " + a.getSequelize());
// };
// 指定返回body内容
// app.$onMountingMiddlewares = () => {
//   app.use(async (ctx, next) => {
//     ctx.body = "hello world";
//   });
// };
app.start();
