import {ErrorRequestHandler, Request, Response} from 'express'
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
export async function deleteUser(req:Request, res:Response){
    const user = await User.findById(req.params.id)
    
}