import mongoose from "mongoose";

const connectmongoDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MONGODB connection failed ", error);
        return null;
    }
};

export { connectmongoDB };
