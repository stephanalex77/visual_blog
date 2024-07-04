import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

export const authenticateToken = (req,res,next)=>{
       const token = req.header('Authentication')?.split('')[1];
       console.log('token:::2',token);

       if (!token) {
          return res.status(401).json({message: 'No token autherization denied'});
       }

       try {
          decoded= jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded.user;
          next();
       } catch (error) {
          res.status(401).json({message:'token is not valid'});
       }
}