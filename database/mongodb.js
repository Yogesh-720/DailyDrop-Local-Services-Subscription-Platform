import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from "../config/env.js";

if(!DB_URI) {
    throw new Error("Please define the MongoDB URI environment variable inside .env.local");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`MongoDB Connected successfully in ${NODE_ENV} mode.`);
    }
    catch(err) {
        console.log("Error Connecting to Database: ",err);
        process.exit(1);
    }
}

export default connectToDatabase;