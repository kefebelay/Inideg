import mongoose, { InferSchemaType, model } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    age:{type:Number, required:true}
}, {timestamps:true})

type UserType = InferSchemaType<typeof userSchema>;

const User = model<UserType>('User', userSchema);

export default User;