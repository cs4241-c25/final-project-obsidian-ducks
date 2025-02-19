import mongoose from 'mongoose';

const url = process.env.MONGODB_URI;
//i named the db WPIBuys and made two collections so far: item and user
//call this function to connect to Database
export async function connectToDatabase(): Promise<void> {
    try {
        if (url === undefined || url === null || url === '') {
            return;
        }
        await mongoose.connect(url);
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw new Error("Database connection failed");
    }
}

connectToDatabase();