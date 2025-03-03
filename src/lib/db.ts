import mongoose from 'mongoose';

const url = process.env.MONGODB_URI;

async function connectToDatabase() {
    try {
      if (url === undefined || url === null || url === '') {
          throw new Error("MongoDB URL must be provided.");
      }
      if (mongoose.connection.readyState) {
          console.log("A MongoDB connection was already established. Close this one.");
      }
      await mongoose.connect(url);
      console.log("Connected to MongoDB :D");
  } catch (e) {
      console.log("Failed to connect to MongoDB D:");
      console.error(e);
  }
}

export default connectToDatabase;
