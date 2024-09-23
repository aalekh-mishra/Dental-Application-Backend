import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/tryCatch";
import ErrorHandler from "../utils/utility";
import { User } from "../models/user";
import { NewUserRequestBody, UserLoginRequestBody } from "../types/types";
import { cookieOptions, sendAdminToken } from "../utils/features";
import bcryptjs from 'bcryptjs'
import httpResponse from "../utils/httpResponse";
import responseMessage from "../constants/responseMessage";


const adminRegister = TryCatch(
    async(
        req: Request<{}, {}, NewUserRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        let userProfile;
        // console.log("req.body: ", req.body );
        const { email, password, countryCode, mobile_number, role, firstName, gender } = req.body;
        // console.log("email: ", email );
        userProfile = {
          firstName: firstName,
          gender: gender,
        }
        // console.log("userProfile: ", userProfile );
        if (!email ) return next(new ErrorHandler("Please send mobile number", 400));
  
        // Check if the email is already registered
        let user = await User.findOne({ email });
        if (user) return next(new ErrorHandler("User already exists", 400));

        const hashedPassword = await bcryptjs.hash(password, 12);
        // Create a new user
        user = new User({
          email,
          password: hashedPassword,
          countryCode, 
          mobile_number,
          role: role,
          profile: userProfile
        });
    
        await user.save();

        httpResponse(req, res, 201, "User registered successfully", user);
});

const adminLoginWithEmailPassword = TryCatch(
  async(
    req: Request<{}, {}, UserLoginRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
      const { email, password } = req.body;

      // Check if the user exists
      const user = await User.findOne({ email }).select('+password');;
      console.log("user: ", user );
      if (!user) return next(new ErrorHandler("Invalid email or password", 400));  
        
      // Check if the password is correct
      const isMatch = await bcryptjs.compare(password, user?.password as string);
      if (!isMatch) return next(new ErrorHandler("Invalid email or password", 400));  

      // Convert the user object to a plain JavaScript object
      const userWithoutPassword = user.toObject();

      // Manually remove the password field
      delete userWithoutPassword.password; // Ensure the password field is removed


      // console.log("userWithoutPassword: ", userWithoutPassword );

      sendAdminToken(res, userWithoutPassword, 200, 'Login successful');

  }
);

const getAdminMyProfile = TryCatch(async (req:any, res, next) => {
  const user:any = await User.findById({ _id: req.userId });

  if(user.role !== "admin") return next(new ErrorHandler("You are not an admin", 400));
  // console.log("user", user);
  httpResponse(req, res, 200, responseMessage.SUCCESS, user);
});

const adminLogOut = TryCatch(async(req, res, next)=> {
  return res
      .status(200)
      .cookie("dnt-admin-access-token", "",{ ...cookieOptions, maxAge: 0})
      .json({
          success: true,
          message: "Logged Out Successfully",
      });
});

// patch code where upload image in cloundinary

// const file = req.file;

//     if(!file) return next(new ErrorHandler("Please Upload Avatar", 400));

//     const result = await uploadFilesToCloudinary([file]);

//     // const avatar = {
//     //     public_id: "Sadlfsjd",
//     //     url: "alsfjsl",
//     // }
//     const avatar = {
//         public_id: result[0].public_id,
//         url: result[0].url,
//     }

export {
  adminRegister,
  adminLoginWithEmailPassword,
  getAdminMyProfile,
  adminLogOut
};