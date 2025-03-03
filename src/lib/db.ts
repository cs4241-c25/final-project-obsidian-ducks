import mongoose from 'mongoose';

const url = process.env.MONGODB_URI;

async function connectToDatabase(): Promise<void> {
    try {
      if (url === undefined || url === null || url === '') {
          throw new Error("MongoDB URL must be provided.");
      }
      const opts = {
          bufferCommands: false,
      };
      await mongoose.connect(url, opts);
      console.log("Connected to MongoDB :D");
  } catch (e) {
      console.log("Failed to connect to MongoDB D:");
      console.error(e);
  }
}

export default connectToDatabase;
