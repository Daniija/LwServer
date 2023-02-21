require('dotenv').config();
import express from 'express';
import config from 'config';
import connectDB from './utils/connectDB';

const app = express();

const port = config.get<number>('port');
app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
    // calling the connect function here
    connectDB();
});