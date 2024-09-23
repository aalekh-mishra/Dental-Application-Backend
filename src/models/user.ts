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

// schema.virtual("age").get(function () {
//   const today = new Date();
//   const dob = this.dob;
//   let age = today.getFullYear() - dob.getFullYear();

//   if (
//     today.getMonth() < dob.getMonth() ||
//     (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
//   ) {
//     age--;
//   }

//   return age;
// });

// export const User = mongoose.model<IUser>("User", schema);

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
//declare user type
export interface IUser extends Document {
    _id: string;
    getSignedToken():string;
    mobile_number: string;
    role: "admin" | "doctor" | "patient" | "manager";
    email: string,
    password?: string,
    otp?: string;
    profile: {
        firstName: String,
        middleName: String,
        lastName: String,
        avatar: String,
        bio: String,
        gender: "male" | "female" | "other";
        dob: Date;
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
    };
    createdAt: Date;
    updatedAt: Date;

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
            enum: ["admin", "doctor", "patient"],
            required: [true, "Please enter role"],
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
// UserSchema.methods.getResetPasswordToken= function () {
//     const resetToken= crypto.randomBytes(20).toString('hex');
//     this.resetPasswordToken= crypto.
//     createHash('sha256')
//     .update(resetToken)
//     .digest('hex');  
//     this.resetPasswordExpire = Date.now() + 10*(60*1000) 
//     return resetToken

// }


export const User = mongoose.model<IUser>("User", UserSchema);