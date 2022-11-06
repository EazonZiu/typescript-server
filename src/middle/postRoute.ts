import express from "express";

// 创建 application/x-www-form-urlencoded 编码解析
const postForm = express.urlencoded({
  // false 解析URL编码时使用querystring库，true 使用qs库
  extended: true,
});

// application/json 编码解析
const postBody = express.json();

export { postForm, postBody };
