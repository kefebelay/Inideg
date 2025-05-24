import {Request, Response} from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';


export  async function login(req: Request, res: Response){
    const JWT_SECRET = process.env.JWT_SECRET || 'Mikasa123';
    try{
    const {email, password} = req.body
    const user = await User.findOne({email});
    if (!user) {
         res.json({message: "Invalid cridentials"});
         return
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
         res.json({message: "Invalid cridentials"});
         return
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

export async function logout(req:Request, res: Response){

   res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}
export async function getLoggedinUser(req:Request, res:Response) {
  const user = await User.findById((req as any).user.id).select('-password');
  res.json(user);
};