import jwt from 'jsonwebtoken'

const authenticate = (req,res,next) => {
    try{
        const token = req.cookies.UserToken;
        if(!token){
            return res.status(403).json({message:"Access denied"});
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch(error){
        console.error("Token validation error:", error);
        return res.status(401).json({message:"Invalid or Expired token"});
    }
}

export {authenticate};