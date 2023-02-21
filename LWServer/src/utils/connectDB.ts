import mongoose from 'mongoose';
import config from 'config';

const databaseUrl = `mongodb://${config.get('dbName')}:${config.get('dbPass')}@localhost:6000/lazworx?authSource=admin`;

const connectDB = async () => {
    try {
        await mongoose.connect(databaseUrl);
        console.log('Connected to database');
    } catch (error: any) {
        console.log(error.message);
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;