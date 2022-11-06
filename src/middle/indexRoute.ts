import { Request, Response, NextFunction } from "express";

export const getTokenRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("route get a token :", req.headers.token);

  next();
};
