import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import taskRoutes from './routes/taskRoute.js';
import autoDeleteOldTrash from './utils/cornJobs.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
autoDeleteOldTrash();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

app.use("/api/tasks", taskRoutes);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);


app.get('/', (req, res) => res.send("Api Working"));

app.listen(PORT, () => {
    console.log("Server started at http://localhost:" + PORT);
});
