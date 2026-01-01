const roleMiddleware = (...allowedRole)=>{
    return(req,res,next)=>{
        if(!allowedRole.includes(req.user.role)){
            return res.status(403).json({message: 'Access denied'})
        }
        next();
    }
}

export default roleMiddleware