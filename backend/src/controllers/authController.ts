import {Request, Response} from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';


async function login(req: Request, res: Response){
    const JWT_SECRET = process.env.JWT_SECRET || 'Mikasa123';
    try{
    const {email, password} = req.body
    const user = await User.findOne({email});
    if (!user) {
        return res.json({message: "Invalid cridentials"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.json({message: "Invalid cridentials"});
    }    
    const token = jwt.sign({id: user._id}, JWT_SECRET,{expiresIn:'1h'});

    res.cookie('token', token, {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
    });


    res.json("Welcome back")

}catch(err:any){
    res.json({error:err})
}
    
}

async function logout(req:Request, res: Response){

    res.json("logged out successfully")
}