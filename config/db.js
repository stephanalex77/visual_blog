import mongoose from "mongoose";

const connectDB = async()=>{
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('mongo connected')
  } catch (error) {
      console.error('error connecting to mongoDB', error.message);
      process.exit(1);
  }
}

export default connectDB;