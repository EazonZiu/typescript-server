import express from "express";
import { PGDB, QueryType, Symbol, FieldType } from "../config/pgPoolConfig";
import parmsFilter from "../middle/filterRoute";
// 创建路由
const indexRoute = express.Router();

// http://localhost:18080/index/test?msg=dfg&age=100&name=特使
indexRoute.get("/get", (req, res) => {
  console.log(req.query);
  console.log(req.query["name"]);
  res.send({ name: "name", age: "nam" });
});

// http://localhost:18080/index/test/qqqq?msg=dfg&age=100&name=特使
indexRoute.get("/test/:id", (req, res) => {
  console.log(req.query);
  console.log(req.params);

  // console.log(req.params.id);
  // console.log(req.params["id"]);

  res.send({ name: "name", age: "man" });
});

// 局部中间件
indexRoute.post("/do/:id", parmsFilter, (req, res) => {
  console.log(req.body);

  res.send({ name: "name", age: "man" });
});

// 局部中间件
indexRoute.post("/add", parmsFilter, (req, res) => {
  const params: FieldType = {
    account: "jkkals",
    real_name: "zzzz",
    user_id: "128419782749",
    password: "ijaosdijijijd",
    sex: "M",
    super_admin_flag: "N",
    status_flag: 1,
  };
  console.log(req.body);

  PGDB.insert("sys_user", params).then((result) => {
    res.send(result);
  });
});

// 局部中间件
indexRoute.post("/update", parmsFilter, (req, res) => {
  const fileds: FieldType = {
    account: "123456",
    sex: "F",
    super_admin_flag: "Y",
  };
  const queryParams: QueryType[] = [
    {
      key: "user_id",
      symbol: Symbol.eq,
      value: "128419782749",
    },
  ];

  PGDB.update("sys_user", fileds, queryParams).then((result) => {
    res.send(result);
  });
});

// 局部中间件
indexRoute.post("/delete", parmsFilter, (req, res) => {
  const queryParams: QueryType[] = [
    {
      key: "user_id",
      symbol: Symbol.eq,
      value: "128419782749",
    },
  ];

  PGDB.delete("sys_user", queryParams).then((result) => {
    res.send(result);
  });
});

// 局部中间件
indexRoute.post("/select", parmsFilter, (req, res) => {
  const queryParams: QueryType[] = [
    {
      key: "user_id",
      symbol: Symbol.eq,
      value: "128419782749",
    },
  ];

  PGDB.select("sys_user", queryParams, []).then((result) => {
    res.send(result);
  });
});

// 局部中间件
indexRoute.post("/query", parmsFilter, (req, res) => {
  console.log(req.body);
  let a!: QueryType;

  if (a) {
    console.log(111);
    console.log(a);
  }
  a = {
    key: "",
    symbol: Symbol.eq,
    value: undefined,
  };
  if (a) {
    console.log(222);
    console.log(a);
  }

  let b!: string[];
  if (b) {
    console.log(3333);
    console.log(b.join(","));
  }
  b = [];
  if (b) {
    console.log(4444);
    console.log(b);
  }
  b = ["aaaa"];
  if (b) {
    console.log(5555);
    console.log(b.join(","));
  }

  PGDB.queryList("select * from sys_user").then((result) => {
    res.send(result);
  });
});

export default indexRoute;
