import { create } from 'zustand';

export const useTaskStore = create((set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),

    createTask: async (newTask) => {
        if (!newTask.title || !newTask.dueDate) {
            return { success: false, message: "Please fill in all required fields." };
        }
        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(newTask)
            });
            const data = await res.json();
            if (!data.success) return { success: false, message: data.message };
            set((state) => ({ tasks: [...state.tasks, data.data] }));
            return { success: true, message: "Task added successfully." };
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    
    fetchTasks: async () => {
        try {
            const res = await fetch("/api/tasks", {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            set({tasks: data.data});
        } catch (error) {
            set({tasks: []});
        }
    },

    deleteTask: async (tid) => {
        try {
            const res = await fetch(`/api/tasks/${tid}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if(!data.success) return {success: false, message: data.message};
            set(state => ({trashedTasks: state.trashedTasks.filter(task => task._id != tid)}));
            return {success: true, message: data.message};
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },

    updateTask: async (tid, updatedTask) => {
        try {
            const res = await fetch(`/api/tasks/${tid}`, {
                method: "PUT",
                credentials: "include",
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
            return { success: true, message: "Task updated successfully."};
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },

    trashedTasks: [],
    setTrashedTasks: (tasks) => set({ trashedTasks: tasks }),

    fetchTrashedTasks: async () => {
        try {
            const res = await fetch("/api/tasks/trash",{
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            set({trashedTasks: data.data});
        } catch (error) {
            set({trashedTasks: []});
        }
    },

    trashTask: async(tid) => {
        try {
            const res = await fetch(`/api/tasks/${tid}/trash`, {
                method: "PATCH",
                credentials: "include"
            });
            const data = await res.json();
            if(!data.success) return { success: false, message: data.message};

            set(state => ({
                tasks: state.tasks.filter(task => task._id !== tid)
            }));

            return { success: true, message: "Task moved to Trash"};
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },

    restoreTask: async(tid) => {
        try {
            const res = await fetch(`/api/tasks/${tid}/restore`, {
                method: "PATCH",
                credentials: "include"
            });
            const data = await res.json();
            if(!data.success) return { success: false, message: data.message};
            set(state => ({
                tasks: [...state.tasks, data.data]
            }));

            set(state => ({
                trashedTasks: state.trashedTasks.filter(task => task._id !== tid)
            }));

            return { success: true, message: "Task restored successfully"};
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },

    clearTrash: async() => {
        try {
            const res = await fetch("/api/tasks/clear-trash",{
                method: "DELETE",
                credentials: "include"
            });
            const data = await res.json();
            if(!data.success) return { success: false, message: data.message};
            set({
                trashedTasks: []
            });
            return { success: true, message: data.message};       
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },

    updateTaskStatus: async (tid, completed) => {
        try {
            const res = await fetch(`/api/tasks/${tid}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
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
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
}));

export default useTaskStore;
