const jwt=require('jsonwebtoken');
const User=require('../models/users');

const generateToken=(user)=>{
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role, tenantId: user.tenantId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}
const verifyToken=async(token)=>{
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.id);
        if(!user){
            throw new Error('User not found');
        }   
        return user;
    }catch(err){
        throw new Error('Invalid token');
    }
}

module.exports={generateToken,verifyToken};

