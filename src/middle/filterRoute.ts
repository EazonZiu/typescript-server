import { Request, Response, NextFunction } from "express";

const parmsFilter = function (req: Request, res: Response, next: NextFunction) {
  console.log(req.headers.token);

  next();
};

export default parmsFilter;
