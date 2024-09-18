import { NextFunction, Request, Response } from "express";
import { ControllerType } from "../types/types";

export const TryCatch = (func: ControllerType) =>
    (req: Request, res: Response, next: NextFunction) => {
      return Promise.resolve(func(req, res, next)).catch(next);
};