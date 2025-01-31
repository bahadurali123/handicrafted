import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
import UserRouter from './routes/user.router.js';
import AdminRouter from './routes/admin.router.js';
import { Configuration } from './config/env.config.js';

app.use(express.json());
app.use(cookieParser()); //its handle the cookies
app.use(cors({
    origin: Configuration.FrontendUrl,
    credentials: true, // Allow credentials (cookies) to be sent
}));

app.use('/', UserRouter, AdminRouter);

export default app;