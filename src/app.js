import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json({ limit: `${process.env.LIMIT}kb` }));
app.use(
    express.urlencoded({
        extended: true,
        limit: `${process.env.LIMIT}kb`,
    })
);
app.use(cookieParser());
app.use(express.static('public'));
app.use(morgan('tiny'));

// custom api routes
import userRoute from './routes/user.route.js';
import storyRoutes from './routes/story.route.js';
import commentRoutes from './routes/comment.route.js';

app.use('/api/v1/user', userRoute);
app.use('/api/v1/story', storyRoutes);
app.use('/api/v1/comment', commentRoutes);

export { app };
