import dotenv from 'dotenv';
import { connectDB } from './db/connection.js';
import { app } from './app.js';

dotenv.config({
    path: './.env',
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port: ${process.env.PORT || 8000}`);
        });
    })
    .catch((error) => {
        console.log(`An error occured: ${error}`);
    });
