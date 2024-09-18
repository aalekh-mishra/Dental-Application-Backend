import { NextFunction, Request, Response } from "express";

import ErrorHandler from "../utils/utility";
import httpError from "../utils/httpError";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err.name === "CastError") err.message = "Invalid ID";

  httpError(next, err, req, err.statusCode, res); 
  
};
