import userModel from '../users/user.model.js'
import bcrypt from 'bcrypt'

export const registerUser = async(req, res)=>{
    try{
        let{name,email,password} = req.body;
        if(!name||!email||!password){
           return res.status(400).json({message: 'All fields are required'})
        }
        name = name.trim();
        email = email.trim().toLowerCase();
        
        const userExist = await userModel.findOne({email})
        if(userExist){
             return res.status(409).json({message: 'user already exist'});
        }

        const passwordHash = await bcrypt.hash(password,12);
        const user = await userModel.create({
            name,
            email,
            passwordHash
        });
        return res.status(201).json({
            message: 'user registered sucessfully', user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }})
    }catch(err){
        console.log(err.message) //should remove//
        return res.status(500).json({message: 'internal server error'})
    }
}