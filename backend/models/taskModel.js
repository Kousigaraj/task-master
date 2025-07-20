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
},{
    timestamps: true
});

const Task = mongoose.model('Task', tasksSchema);

export default Task;