import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=mongoose.Schema({
   username:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    index:true
   },
   email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
   },
   fullname:{
    type:String,
    required:true,
    trim:true
   },
   avatar:{
    type:String,
    required:true
   },
   coverImage:{
     type:String
   },
   watchHistory:[
    {
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
   ],
   password:{
    type:String,
    required:[true,"Pass is required"]
   },
   refreshToken:{
    type:String
   }
},{timestamps:true})

userSchema.pre("save",async function (next){
    if(!this.isModified("password"))
        return next();
      const salt=10
      this.password=await bcrypt.hash(this.password,salt)
      next()
})

userSchema.methods.isPasswordcorrect=async function(password)
{
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)

}

userSchema.methods.generateRefreshToken=function(){
    jwt.sign({
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)

}

export const User=mongoose.model("User",userSchema)