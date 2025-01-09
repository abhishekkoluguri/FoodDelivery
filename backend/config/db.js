import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://greatstack:33858627@cluster0.iso0e.mongodb.net/food_del_app').then(()=>console.log("Db connected"))
}