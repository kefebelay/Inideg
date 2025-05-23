import mongoose, { InferSchemaType, model } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    role:{type:String, required:true, enum:['user', 'admin', 'business'], default:'user'},
    age:{type:Number, required:true}
}, {timestamps:true})

type UserType = InferSchemaType<typeof userSchema>;

const User = model<UserType>('User', userSchema);

export default User;