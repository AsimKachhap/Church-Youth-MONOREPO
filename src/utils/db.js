import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      "Your Database is hosted at :",
      connectionInstance.connection.host
    );

    console.log("Connected to MongoDB.");
  } catch (error) {
    console.log("MongoDB connection FAILED!!!", error);
    process.exit(1);
  }
};

export default connectDB;
