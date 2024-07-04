import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/helpers/emailHelper.js";
import { generateToken } from "../utils/helpers/jwtHelper.js";

export const signUp = async (req, res) => {
  console.log("body body:::", req.body);
  const { username, email, password } = req.body;

  try {

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }

    //generate otp
    const otp = Math.floor(1000 + Math.random() * 90000).toString();
    const otpExpires = Date.now() + 2 * 60 * 1000;
    console.log("OTP:", otp);

     //hashing password
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password, salt); 
     user = new User({
       username,
       email,
       password: hashedPassword,
       otp,
       otpExpires,
     });
     
    await user.save();

    try {
      await sendEmail(email, otp);
    res.status(200).json({message: 'OTP SEND TO EMAIL, PLEASE VERIFY'});
    } catch (error) {
      console.error(error.message);
      res.status(500).send('error sending otp')
    }
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
};

export const verifyOtp = async (req, res)=>{
      console.log('verify body::',req.body);

      const {email, otp} = req.body;
      console.log(req.body.email);

       try {

        const user = await User.findOne({email});
        
        if(!user){
          return res.status(404).json({message: 'USER NOT FOUND'});
        }

        //verify otp
        if(user.otp === otp && user.otpExpires > Date.now()){
          user.isVerified = true, user.otp = null, user.otpExpires = null;
          await user.save();

          //generateToken
          generateToken(res, user)
          
          res.status(200).json({message: 'OTP VERIFIED SUCCESSFULLY'});
        }else{
          res.status(400).json({message:'invalid otp or otp expired'});
        }

       } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
       }

}


export const login = async(req, res)=>{
    
    const {email, password} = req.body;

    try {

      const user = await User.findOne({email: email})
      console.log(user);

      if(!user){
        return res.status(404).json({message:'user not found'})
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch){
        res.status(404).json({message:'invalid credential'});
      }

      if(!user.isVerified){
        res.status(404).json({message:'user is not verified'})
      }

      generateToken(res, user);
      console.log('generateToken::::::',generateToken);

      res.status(200).json({message:'Login successful'})

    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
};