import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import taskRoutes from './routes/taskRoute.js';
import autoDeleteOldTrash from './utils/cornJobs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
    autoDeleteOldTrash();
});
