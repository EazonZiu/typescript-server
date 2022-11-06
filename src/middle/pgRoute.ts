// 中间路由实现pg sequelize

import { Request, Response, NextFunction } from "express";
import { PG_CONTEXT } from "../config/pgSequelizeConfig";

const pgRoute = function (req: Request, res: Response, next: NextFunction) {
  PG_CONTEXT;
  next();
};

export default pgRoute;
