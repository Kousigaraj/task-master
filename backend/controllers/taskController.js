import Task from '../models/taskModel.js';
import mongoose from 'mongoose';

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({deletedAt: null});
        res.status(200).json({ success: true, data: tasks});
    } catch (error) {
        console.error("Error in fetching task: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

export const createTask = async (req, res) => {
    const task = req.body;
    if(!task.title || !task.dueDate){
        return res.status(400).json({ success: false, message: "Please provide all details"});
    }

    const newTask = new Task(task);

    try {
        await newTask.save();
        res.status(201).json({ success: true, data: newTask});
    } catch (error) {
        console.error("Error in Creating task: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

export const updateTask = async (req, res) => {
    const {id} = req.params;

    const task = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid Task Id"});
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, task, {new:true});
        res.status(200).json({ success: true, data: updatedTask});
    } catch (error) {
        console.error("Error in Updating task: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

export const deleteTasks = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid Task Id"});
    }
    
    try {
        await Task.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Task deleted"});
    } catch (error) {
        console.error("Error in deleting task: ", error.message);
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { completed } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error"});
  }
};

export const moveToTrash = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, {
      deletedAt: new Date(),
    });
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const restoreFromTrash = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, {
      deletedAt: null,
    });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getTrashed = async (req, res) => {
  try {
    const trashedTasks = await Task.find({ deletedAt: { $ne: null } });
    res.status(200).json({ success: true, data: trashedTasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearTrash = async (req, res) => {
  try {
    const result = await Task.deleteMany({
      deletedAt: { $ne: null }
    });

    res.json({ success: true, message: `Cleared ${result.deletedCount} trashed tasks.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear trashed tasks.' });
  }
}