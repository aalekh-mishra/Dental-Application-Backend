import mongoose from 'mongoose';

const connectDB = async (dbUri: string | undefined) => {
    try {
        await mongoose.connect(dbUri as string);
        // console.log(`MongoDB connected successfully database at ${dbUri}`);
        return mongoose.connection;
    } catch (error) {
        // console.error('Error connecting to MongoDB:', error);
        // throw error
        process.exit(1); // Exit process with failure
        
    }
};

export default connectDB;
