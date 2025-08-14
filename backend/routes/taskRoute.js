import express from 'express';
import { clearTrash, createTask, deleteTasks, getTasks, getTrashed, moveToTrash, restoreFromTrash, updateTask, updateTaskStatus } from '../controllers/taskController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.use(userAuth);

router.get("/", getTasks);
router.get('/trash', getTrashed);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete('/clear-trash', clearTrash)
router.delete("/:id", deleteTasks);
router.patch('/:id', updateTaskStatus);
router.patch('/:id/trash', moveToTrash);
router.patch('/:id/restore', restoreFromTrash);

export default router;