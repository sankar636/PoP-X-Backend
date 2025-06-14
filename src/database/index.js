import mongoose from "mongoose";

const connectDataBase = async () => {
    const DB_NAME = 'PoP-X';
    console.log("Connecting to MongoDB...");
    console.log("MONGODB_URI:", process.env.MONGODB_URI);

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`);
        console.log(`✅ MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("❌ Error while connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDataBase;