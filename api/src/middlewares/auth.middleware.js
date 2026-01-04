import jwt from 'jsonwebtoken';

const authMiddleware = async function (req,res,next){
    try{
        const token = req.cookies?.token;
        if(!token){
            return res.status(401).json({message: 'Not Authenticated'})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user={
            id: decoded.id,
            role: decoded.role
        }

        next();
    }catch(error){
        return res.status(401).json({message: "invalid or expired token"})
    }
}

export default authMiddleware