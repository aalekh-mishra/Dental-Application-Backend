import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { TryCatch } from "./tryCatch";
import ErrorHandler from "../utils/utility";
import config from "../config/config";

const isAuthenticated = TryCatch(async(req:any, res, next) => {

  // console.log("req.cookies", req.cookies['dnt-access-token']);
  const token =  req.cookies['dnt-access-token'];

  if(!token) return next(new ErrorHandler("Please login to access this route", 401));

  //verify token
  const decodedData:any = jwt.verify(token, config.JWT_SECRET as string);

  req.userId = decodedData._id;
  const user = await User.findById(decodedData._id);

  req.user = user
  next();
});

const isPatientAuthenticated = TryCatch(async(req:any, res, next) => {

  // console.log("req.cookies", req.cookies['dnt-access-token']);
  const token =  req.cookies['dnt-access-token'];

  if(!token) return next(new ErrorHandler("Please login to access this route", 401));

  //verify token
  const decodedData:any = jwt.verify(token, config.JWT_SECRET as string);

  req.userId = decodedData._id;
  const user:any = await User.findById(decodedData._id);

  if(user.role !== 'patient') return next(new ErrorHandler("Please you are not patient", 403));

  req.user = user
  next();
});

const isDoctorAuthenticated = TryCatch(async(req:any, res, next) => {

  // console.log("req.cookies", req.cookies['dnt-access-token']);
  const token =  req.cookies['dnt-access-token'];

  if(!token) return next(new ErrorHandler("Please login to access this route", 401));

  //verify token
  const decodedData:any = jwt.verify(token, config.JWT_SECRET as string);

  req.userId = decodedData._id;
  const user:any = await User.findById(decodedData._id);

  // console.log("user: ", user);

  if(user.role !== 'doctor') return next(new ErrorHandler("Please you are not doctor", 403));

  req.user = user
  next();
});

// Middleware to make sure only admin is allowed
const adminOnly = TryCatch(async (req:any, res, next) => {

   console.log("req.cookies", req.cookies['dnt-admin-access-token']);
  const token =  req.cookies['dnt-admin-access-token'];

  if(!token) return next(new ErrorHandler("Please login to access this route", 401));

  //verify token
  const decodedData:any = jwt.verify(token, config.JWT_ADMIN_SECRET as string);
  console.log(" decodedData._id;",  decodedData._id);
  req.userId = decodedData._id;

  const user:any = await User.findById(decodedData._id  );
  console.log("user", user);

  if (!user) return next(new ErrorHandler("Please login to access this route", 401));

  if (user.role !== "admin") return next(new ErrorHandler("Please you are not admin", 403));

  req.user = user
  next();
});

export { isAuthenticated, isPatientAuthenticated, isDoctorAuthenticated, adminOnly };