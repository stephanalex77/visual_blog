import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

export const generateToken = (res,user)=>{
  const payload = { user: { id: user.id } };
  console.log("payload:::", payload);
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("token:::1", token);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 1 * 60 * 60 * 1000,
  });
  console.log("response:::", res);
}