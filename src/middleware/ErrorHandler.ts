import { Request, Response, NextFunction } from "express";
import { RESPONSE_TYPE } from "../utils/types";
import { HttpResponse } from "../utils/misc";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  let data: RESPONSE_TYPE = {
    message: err.message || "Internal Server Error",
    data: [],
    status: 500,
  };

  return HttpResponse(res, data);
};
