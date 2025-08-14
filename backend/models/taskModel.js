import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({
    title:{ 
        type: String, 
        required: true
    },
    description:{ 
        type: String 
    },
    dueDate:{
        type: Date 
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    completed:{ 
        type: Boolean, 
        default: false 
    },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
},{
    timestamps: true
});

const Task = mongoose.models.Task || mongoose.model('Task', tasksSchema);

export default Task;