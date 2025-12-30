import userModel from '../users/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

export const loginUser = async (req,res)=>{
    try{
        let{email,password} = req.body
        if(!email||!password){
            return res.status(400).json({message:'Email and Password are required'})
        }
        email = email.trim().toLowerCase();
        const user = await userModel.findOne({email}).select('+passwordHash')
        if(!user){
            return res.status(401).json({message: 'invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch) return res.status(401).json({message: 'invalid credentials'});

        const token = jwt.sign({
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
        )

        const isProd = process.env.NODE_ENV === 'production'
        res.cookie('token',token,{
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: 'Login sucessfull',
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });


    }catch(error){
        return res.status(500).json({message: 'internal server error'});
    }
};