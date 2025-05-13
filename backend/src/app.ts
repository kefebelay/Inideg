import express from 'express';
import mongoose from 'mongoose';
import mainRouter  from './routes';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
app.use(express.json());

app.use('/api', mainRouter)

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
