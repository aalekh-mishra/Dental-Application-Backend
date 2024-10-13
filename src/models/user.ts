// import mongoose from "mongoose";
// import validator from "validator";

// interface IUser extends Document {
//   _id: string;
//   mobile_number: string;
//   name: string;
//   email: string;
//   photo: string;
//   role: "admin" | "doctor" | "patient";
//   gender: "male" | "female" | "other";
//   dob: Date;
//   createdAt: Date;
//   updatedAt: Date;
//   //   Virtual Attribute
//   age: number;
// }

// const schema = new mongoose.Schema(
//   {
//     _id: {
//       type: String,
//       required: [true, "Please enter ID"],
//     },
//     mobile_number: {
//         type: String,
//         required: [true, "Please enter Name"],
//     },
//     name: {
//       type: String,
//       required: [true, "Please enter Name"],
//     },
//     email: {
//       type: String,
//       unique: [true, "Email already Exist"],
//       required: [true, "Please enter Name"],
//       validate: validator.default.isEmail,
//     },
//     photo: {
//       type: String,
//       required: [true, "Please add Photo"],
//     },
//     role: {
//       type: String,
//       enum: ["admin", "doctor", "patient"],
//       default: "patient",
//     },
//     gender: {
//       type: String,
//       enum: ["male", "female"],
//       required: [true, "Please enter Gender"],
//     },
//     dob: {
//       type: Date,
//       required: [true, "Please enter Date of birth"],
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { model, Schema, Model, Document } from 'mongoose';

//declare point type
export interface IPoint extends Document {
    type:string;
    coordinates:string;
}
//generate point schema
const Point:Schema= new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});
interface IProfile {
    firstName: String,
    middleName: String,
    lastName: String,
    avatar: String,
    bio: String,
    gender: "male" | "female" | "other";
    dob: Date; // Assuming dob is of type Date
    address: {
        street1: String,
        street2: String,
        city: String,
        state: String,
        country: String,
        zip: String,
        location: {
            type: IPoint,
            required: false
        }
    },
    age: number; //   Virtual Attribute
    active:true
}
// profile: IProfile;
//declare user type
export interface IUser extends Document {
    _id: string;
    mobile_number: string;
    role: "admin" | "doctor" | "patient" | "manager";
    status: "patient_approved" | "doctor_approved" | "admin_approved" | "manager_approved" | "rejected" | "pending" | "blocked",
    email: string,
    password?: string,
    otp?: string;
    profile: IProfile;
    createdAt: Date;
    updatedAt: Date;
    createdOtpAt: Date;
    expiresOtpAt: Date;
}
// define user schema
const UserSchema: Schema = new Schema({
        mobile_number: {
            type: String,
            unique: true,
            required: [true, "Please enter Mobile Number"],
            index: true
        },
        role: {
            type: String,
            enum: ["admin", "doctor", "patient", "manager"],
            required: [true, "Please enter role"],
        },
        status: {
            type: String,
            enum: ["patient_approved", "doctor_approved", "admin_approved", "manager_approved", "rejected", "pending", "blocked"],
            default: "patient_approved",
        },
        countryCode: {
            type: String,
            required: [true, "Country Code is required"],
        },
        email: {
            type: String,
            lowercase: true,
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid address'],
            unique:true,
            sparse: true  // This allows multiple null values
        },
        password: {
            type: String,
            required: false,
            select: false // This will exclude password from the result by default
        },
        otp: {
            type: String,
            required: false,
            select: false // This will exclude otp from the result by default
        },
        profile: {
            firstName: String,
            middleName: String,
            lastName: String,
            avatar: String,
            bio: String,
            gender: {
                type: String,
                enum: ["male", "female", "other"],
            },
            dob: {
                type: Date,
                required: false,
            },
            address: {
                street1: String,
                street2: String,
                city: String,
                state: String,
                country: String,
                zip: String,
                location: {
                    type: Point,
                    required: false
                }
            },
        },
        active: { type: Boolean, default: true },
        createdOtpAt: { type: Date, default: Date.now },
        expiresOtpAt: { type: Date, required: true },
    }, 
    {
        timestamps: true,
    }
);


UserSchema.methods.getSignedToken = function (password:string) {
    return jwt.sign({ id:this._id }, process.env.JWT_SECRET!,{
        expiresIn: process.env.JWT_EXPIRE
    })   
}

// Create a TTL index to automatically remove documents after 5 minutes
// UserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for calculating age
UserSchema.virtual("age").get(function (this: IUser) {
    const today = new Date();
    const dob = this.profile?.dob;
    
    // Check if dob is defined and is a valid Date
    if (!dob || !(dob instanceof Date)) {
        return null; // Or you can return a default value, like 0 or an error message
    }
  
    let age = today.getFullYear() - dob.getFullYear();
  
    if (
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
      age--;
    }
  
    return age;
});

// UserSchema.methods.getResetPasswordToken= function () {
//     const resetToken= crypto.randomBytes(20).toString('hex');
//     this.resetPasswordToken= crypto.
//     createHash('sha256')
//     .update(resetToken)
//     .digest('hex');  
//     this.resetPasswordExpire = Date.now() + 10*(60*1000) 
//     return resetToken

// }

// Include virtuals in JSON output
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

export const User = mongoose.model<IUser>("User", UserSchema);
