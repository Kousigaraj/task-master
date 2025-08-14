import Task from '../models/taskModel.js';
import mongoose from 'mongoose';

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({userId: req.user.userId, deletedAt: null});
        res.status(200).json({ success: true, data: tasks});
    } catch (error) {
        console.error("Error in fetching task: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

export const createTask = async (req, res) => {
    const {title, description, dueDate} = req.body;
    const {userId} = req.user;
    if(!title || !dueDate || !userId){
        return res.status(400).json({ success: false, message: "Please provide all details"});
    }

    const newTask = new Task({
      title, 
      description, 
      dueDate, 
      userId
    });

    try {
        await newTask.save();
        res.status(201).json({ success: true, data: newTask});
    } catch (error) {
        console.error("Error in Creating task: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Task ID" });
    }

    try {
        // Find task and ensure it belongs to the user and is not deleted
        const task = await Task.findOne({ _id: id, userId, deletedAt: null });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
        }

        // Apply updates safely
        if (updates.title !== undefined) task.title = updates.title;
        if (updates.description !== undefined) task.description = updates.description;
        if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
        if (updates.completed !== undefined) task.completed = updates.completed;

        await task.save();

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.error("Error in updating task:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const deleteTasks = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Task Id" });
    }

    try {
        const deletedTask = await Task.findOneAndDelete({ _id: id, userId });

        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Task deleted permanently." });
    } catch (error) {
        console.error("Error in deleting task:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Task ID" });
  }

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId },
      { completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
    }

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    console.error("Error updating task status:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const moveToTrash = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Task ID" });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId }, 
      { deletedAt: new Date() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    console.error("Error in moving task to trash:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const restoreFromTrash = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Task ID" });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { deletedAt: null },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    console.error("Error in restoring task:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getTrashed = async (req, res) => {
  const { userId } = req.user;

  try {
    const trashedTasks = await Task.find({
      userId,
      deletedAt: { $ne: null }
    });

    res.status(200).json({ success: true, data: trashedTasks });
  } catch (err) {
    console.error("Error fetching trashed tasks:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const clearTrash = async (req, res) => {
  const { userId } = req.user;

  try {
    const result = await Task.deleteMany({
      userId,
      deletedAt: { $ne: null }
    });

    res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} trashed task${result.deletedCount !== 1 ? 's' : ''}.`
    });
  } catch (err) {
    console.error("Error clearing trash:", err.message);
    res.status(500).json({ success: false, message: "Failed to clear trashed tasks." });
  }
};