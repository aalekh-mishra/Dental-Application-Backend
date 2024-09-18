import { NextFunction, Request, Response } from "express";

export interface NewUserMobileRequestBody {
  _id: string;
  countryCode: string;
  mobile_number: string;
  role: string;
}
export interface NewUserRequestBody {
  email: string;
  password: string;
  countryCode: string;
  mobile_number: string;
  role: string;
  firstName: String;
  gender: String;
}
export interface UserLoginRequestBody {
  email: string;
  password: string;
}
export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type THttpResponse = {
  success: boolean
  statusCode: number
  request: {
      ip?: string | null
      method: string
      url: string
  }
  message: string
  data: unknown
}

export type THttpError = {
  success: boolean
  statusCode: number
  request: {
      ip?: string | null
      method: string
      url: string
  }
  message: string
  data: unknown
  trace?: object | null
}

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};