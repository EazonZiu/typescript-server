import express from "express";
import { UserType } from "../model/user";
import { UserService, UserServiceImpl } from "../service/userService";
// 创建路由
const userRoute = express.Router();

const userService: UserService = new UserServiceImpl();

userRoute.post("/add", async (req, res) => {
  // const entity: UserType = {
  //   account: "jkkals",
  //   realName: "zzzz",
  //   userId: "128419782749",
  //   sex: "M",
  //   superAdminFlag: "N",
  //   statusFlag: 1,
  // };

  // {
  //   "account": "zzzzz",
  //  "realName": "zzzz",
  //  "userId": "128419782749",
  //  "sex": "M",
  //  "superAdminFlag": "N",
  //  "statusFlag": 1
  // }
  res.send(await userService.create(req.body));
});

userRoute.post("/update/:id", async (req, res) => {
  await userService.update(req.params.id, req.body).then(([count, rows]) => {
    if (count > 0) {
      res.send({ rows: rows, status: "success" });
    } else {
      res.send({ status: "error" });
    }
  });
});

userRoute.post("/delete/:id", async (req, res) => {
  await userService.delete(req.params.id).then((n) => {
    if (n > 0) {
      res.send({ row: n, status: "success" });
    } else {
      res.send({ row: n, status: "error" });
    }
  });
});

userRoute.get("/list", async (req, res) => {
  res.send(await userService.findAll(req.query));
});

userRoute.get("/page", async (req, res) => {
  res.send(await userService.page(req.query));
});

userRoute.get("/findUserId", async (req, res) => {
  res.send(await userService.findUserId(req.query));
});

export default userRoute;
