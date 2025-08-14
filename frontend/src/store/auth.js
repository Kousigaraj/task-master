import { create } from 'zustand';


export const useAuthStore = create((set) => ({
    userData: null,
    isAuthenticated: false,
    checkAuth: async () => {
        try {
            const res = await fetch('/api/auth/is-auth', {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            if(data.success){
                set({isAuthenticated: true});
            }
        } catch (error) {
            set({isAuthenticated: false});
            return { success: false, message: "Network error. Please try again." };
        }
    },
    getUserDetails: async () => {
        try {
            const res = await fetch('/api/user/data', {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if(data.success){
                set({userData: data.userData});
            } else {
                set({userData: null});
            }
            return data;
        } catch (error) {
            set({userData: null});
            return { success: false, message: "Network error. Please try again." };
        }
    },
    register: async (name, email, password, confirmPassword) => {
        if (!name || !email || !password || !confirmPassword) {
            return {success: false, message: 'Provide all Details'};
        }
        if(password !== confirmPassword){
            return {success: false, message: 'Passwords do not match.'}
        }
        try {
            const res = await fetch('/api/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name, email, password})
            });
            const data = await res.json();
            if(!data.success) return data;
            set({isAuthenticated: true});
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    login: async (email, password) => {
        if (!email || !password) {
            return {success: false, message: 'Provide all Details'};
        }
        try {
            const res = await fetch('/api/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password}),
                credentials: "include"
            });
            const data = await res.json();
            if(data.success){
                set({isAuthenticated: true});
            }
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    logout: async () => {
        try {
            const res = await fetch('/api/auth/logout', {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            if(data.success){
                set({isAuthenticated: false, userData: null});
            }
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    sendVerifyOtp: async () => {
        try {
            const res = await fetch('/api/auth/send-verify-otp', {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    verifyAccount: async (otp) => {
        try {
            const res = await fetch('/api/auth/verify-account', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ otp }),
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                set((state) => ({ userData: { ...state.userData, isAccountVerified: true } }));
            }
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    changePassword: async (password, newPassword, confirmNewPassword) => {
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return {success: false, message: 'Provide all Details'};
        }
        if(newPassword !== confirmNewPassword){
            return {success: false, message: 'Passwords do not match.'}
        }
        try {
            const res = await fetch('/api/auth/change-password', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({password, newPassword}),
                credentials: "include"
            });
            const data = await res.json();
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    updateUserData: async (name, email, emailNotification, isAccountVerified) => {
        if (!name || !email) {
            return {success: false, message: 'Provide all Details'};
        }
        try {
            const res = await fetch('/api/user/update-data', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name, email, emailNotification, isAccountVerified}),
                credentials: "include"
            });
            const data = await res.json();
            if(data.success){
                set({userData: {...data.userData}});
            }
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    updateEmail: async (newEmail) => {
        if (!newEmail) {
            return { success: false, message: 'Provide a new email address.' };
        }
        try {
            const res = await fetch('/api/user/update-email', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: newEmail }),
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                set({ userData: { ...data.userData } });
            }
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    deleteUserAccount: async () => {
        try {
            const res = await fetch('/api/user/delete-account', {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();
            if(data.success){
                set({isAuthenticated: false, userData: null});
            }
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    sendResetOtp: async (email) => {
        if (!email) {
            return { success: false, message: 'Provide an email address.' };
        }
        try {
            const res = await fetch('/api/auth/send-reset-otp', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email }),
                credentials: "include"
            });
            const data = await res.json();
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    verifyOtp: async (email, otp) => {
        if (!email || !otp) {
            return { success: false, message: 'Provide email and OTP.' };
        }
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, otp }),
                credentials: "include"
            });
            const data = await res.json();
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    },
    resetPassword: async (email, otp, newPassword) => {
        if (!email || !otp || !newPassword) {
            return { success: false, message: 'Provide email, OTP, and new password.' };
        }
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, otp, newPassword }),
                credentials: "include"
            });
            const data = await res.json();
            return data;
        } catch (error) {
            return { success: false, message: "Network error. Please try again." };
        }
    }

}))

export default useAuthStore;