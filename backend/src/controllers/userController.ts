import { Request, Response} from 'express'
import User from '../models/User';

export async function createUser(req:Request, res:Response){
    try{
        const user = new User(req.body)
        const saved = await user.save()
        res.status(201).json(saved);
    }
    catch(err:any){
        res.json({error: err.message})
    }
}
export async function deleteUser(req: Request, res: Response) {    
    try{
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await User.findByIdAndDelete(user.id);
    res.status(200).json({ message: `${user.name} deleted` });}
    catch(e){
        res.json({error:e})
    }
}
export async function getuser(req:Request, res:Response){
    const user = await User.findById(req.params.id)
    res.status(200).json({user:user})
}
export async function getUsers(req:Request, res:Response){
    const users = await User.find()
    res.status(200).json({users:users})
}