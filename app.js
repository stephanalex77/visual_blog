import express from 'express'
import connectDB from './config/db.js';
import dotenv from 'dotenv'
import userRouter from './routes/userRoute.js';




const app = express();
app.use(express.json())
dotenv.config();
connectDB();
app.use('/user', userRouter)
app.use("/", (req, res, next)=>{
  res.send('hello world')
})

app.listen(3000, ()=>{
  console.log('server is running');
})
