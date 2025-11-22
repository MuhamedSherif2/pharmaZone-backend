const jwt = require("jsonwebtoken");
const User=require("../models/user.model")
 
exports.authenticate= async (req,res,next)=>{
    const authHeader= req.headers.authorization;
    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({message:"no token provider"})
    
    }
    const token=authHeader.split(" ")[1]
    try{
    const decode= jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(decode.id)
    console.log(user)
    
    if(!user){
        return res.status(404).json({message:"user not found"})
    
    }
    req.user=user;
    return next()
    }
    catch(err){
    return   res.status(403).json({message:"token is not valid or expired"})
    
    
    }
 
 
next()
}
exports.authorize=(...allowedRoles)=>{
    return(req,res,next)=>{
        const userRole=req.user.role
 
 
    if(allowedRoles.includes(userRole)){
 return next()
    }
     return res.status(403).json({error:"access denaid"})
}
}