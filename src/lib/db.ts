import mongoose from 'mongoose';

const url = process.env.MONGODB_URI;

//i named the db WPIBuys and made two collections so far: item and user
//call this function to connect to Database
async function connectToDatabase(): Promise<void> {
    if (url === undefined || url === null || url === '') {
        return;
    }
    await mongoose.connect(url);
}

connectToDatabase()
    .then(() => {
        console.log("Connected to MongoDB :D");
    })
    .catch((e) => {
        console.log("Failed to connect to MongoDB D:");
        console.error(e);
});