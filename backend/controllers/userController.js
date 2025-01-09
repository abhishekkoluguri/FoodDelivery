import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


//login user
const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"user doesnot exist"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalis credentials"})
        }

        const token=createToken(user._id);
        res.json({success:true,token})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//reqister user
const registerUser=async(req,res)=>{
    const {name,password,email}=req.body;
    try{
        //checking if user already exists
        const exists=await userModel.findOne({email});
        if(exists){
            return res.json({success:false,message:"User already exists"})
        }

        //validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"ENter valid email"})
        }

        //password length is <8
        if(password.length<8){
            return res.json({success:false,message:"Enter strong password"})
        }
        //hasing user pwd
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hashSync(password,salt)

        const newUser=new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user=await newUser.save()
        const token=createToken(user._id)
        res.json({success:true,token})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"error"})
    }
}

export {loginUser,registerUser}