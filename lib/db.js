import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

async function dbConnect() {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to mongodb");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to mongodb");
  } catch (error) {
    console.error("Failed to connect to mongodb", error);
    throw error;
  }
}

export default dbConnect;
