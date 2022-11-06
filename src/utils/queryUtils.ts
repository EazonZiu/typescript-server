import { Request } from "express";
import qs from "qs";

export function getParams(req: Request): Map<string, string> {
  const params: Map<string, any> = new Map();

  // 获取绑定参数
  for (const key in req.query) {
    const val = req.query[key];
    params.set(key, val);
    // if (typeof val === undefined) {
    //   continue;
    // }
    // // if (val instanceof Array) {
    // //   // params.set(key, val);
    // // }
    // // if (val instanceof Object) {
    // //   params.set(key, val);
    // // }
    // else {
    //   params.set(key, req.query[key]);
    // }
    // console.log(key, "-", val);
    // console.log(val instanceof Array);
    // console.log(val instanceof Object);
    // console.log(toString.call(val));
  }

  console.log("------------");
  // console.log(JSON.stringify(req.query));
  // const a: Map<String, String> = JSON.parse(JSON.stringify(req.query));
  params.forEach((value, key) => {
    console.log(key, " - ", value);
  });

  console.log(params);

  console.log("------------");

  // 获取动态参数

  for (const key in req.params) {
    params.set(key, req.params[key]);
  }

  return params;
}

export function getStrParams(req: Request): string {
  const params: Map<string, string> = getParams(req);

  return JSON.stringify(params);
}

// function isString(param: any): param is string {}
