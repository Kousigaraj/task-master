import { create } from 'zustand';

export const useTaskStore = create((set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),

    createTask: async (newTask) => {
        if (!newTask.title || !newTask.dueDate) {
            return { success: false, message: "Please fill in all required fields." };
        }
        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newTask)
        });
        const data = await res.json();
        set((state) => ({ tasks: [...state.tasks, data.data] }));
        return { success: true, message: "Task added." };
    },
    
    fetchTasks: async () => {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        set({tasks: data.data});
    },

    deleteTask: async (tid) => {
        const res = await fetch(`/api/tasks/${tid}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if(!data.success) return {success: false, massage: data.message};
        set(state => ({trashedTasks: state.trashedTasks.filter(task => task._id != tid)}));
        return {success: true, message: data.message};
    },

    updateTask: async (tid, updatedTask) => {
        const res = await fetch(`/api/tasks/${tid}`, {
            method: "PUT",
            headers: {
                "content-Type" : "application/json",
            },
            body: JSON.stringify(updatedTask),
        });
        const data = await res.json();
        if(!data.success) return { success: false, message: data.message};
        set(state => ({
            tasks: state.tasks.map(task => task._id === tid ? data.data : task)
        }));
        return { success: true, message: "Task Updated."};
    },

    trashedTasks: [],
    setTrashedTasks: (tasks) => set({ trashedTasks: tasks }),

    fetchTrashedTasks: async () => {
        const res = await fetch("/api/tasks/trash");
        const data = await res.json();
        set({trashedTasks: data.data});
    },

    trashTask: async(tid) => {
        const res = await fetch(`/api/tasks/${tid}/trash`, {method: "PATCH"});
        const data = await res.json();
        if(!data.success) return { success: false, message: data.message};

         set(state => ({
            tasks: state.tasks.filter(task => task._id !== tid) // remove from active list
        }));

        return { success: true, message: "Task moved to Trash"};
    },

    restoreTask: async(tid) => {
        const res = await fetch(`/api/tasks/${tid}/restore`, 
            {method: "PATCH"});
        const data = await res.json();
        if(!data.success) return { success: false, message: data.message};
        set(state => ({
            tasks: [...state.tasks, data.data]
        }));

        set(state => ({
            trashedTasks: state.trashedTasks.filter(task => task._id !== tid)
        }));

        return { success: true, message: "Task restored successfully"};
    },

    clearTrash: async() => {
        const res = await fetch("/api/tasks/clear-trash",{
            method: "DELETE"
        });
        const data = await res.json();
        if(!data.success) return { success: false, message: data.message};
        set({
            trashedTasks: []
        });
        return { success: true, message: data.message};       
    },

    updateTaskStatus: async (tid, completed) => {
        const res = await fetch(`/api/tasks/${tid}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ completed }),
        });

        const data = await res.json();
        if(!data.success) return { success: false, message: data.message};
        set((state) => ({
            tasks: state.tasks.map((task) =>
            task._id === tid ? { ...task, completed: data.data.completed } : task
            ),
        }));

        return { success: true, message: completed ? "Task marked as completed." : "Task marked as pending." };
    },

    toastData: {},
    setToastData: (toastData) => set({ toastData }),

    show: false,
    setShow: (show) => set({ show }),
}));
