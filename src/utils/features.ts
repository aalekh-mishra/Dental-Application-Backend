import { Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";

const cookieOptions:any = {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
}
const sendToken = async (res: Response, user:any, code:number, message:string) => {
    // Generate JWT token
    const token = jwt.sign({_id: user._id}, config.JWT_SECRET as string, { expiresIn: '90d' });

    return res
        .status(code)
        .cookie("dnt-access-token", token, cookieOptions)
        .json({
            success: true,
            token,
            user,
            message
        });
};
const sendAdminToken = async (res: Response, user:any, code:number, message:string) => {
 
    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, config.JWT_ADMIN_SECRET as string, { expiresIn: '15d' });
    return res
        .status(code)
        .cookie("dnt-admin-access-token", token, cookieOptions)
        .json({
            success: true,
            token,
            user,
            message
        });
};

export { 
    sendToken, 
    sendAdminToken,
    cookieOptions, 
};