import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = (to, otp)=>{
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "for varification mail",
    text: `your otp code is ${otp}`,
  };

  return new Promise((resolve, reject)=>{
    transporter.sendMail(mailOptions, (error, info)=>{
      if(error){
        return reject(error);
      }
      resolve(info);
    })
  })
}

