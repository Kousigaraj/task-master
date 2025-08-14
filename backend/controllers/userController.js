import userModel from "../models/userModel.js";
import Task from "../models/taskModel.js";
import mongoose from "mongoose";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ 
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                emailNotification: user.emailNotification,
            }
        });
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUserAccount = async (req, res) => {
    try {
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await Task.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
        await userModel.findByIdAndDelete(userId);

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });

        return res.status(200).json({ success: true, message: 'User account and tasks deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUserData = async (req, res) => {
    try {
        const { name, email, emailNotification, isAccountVerified } = req.body;
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!name && !email && typeof emailNotification === "undefined" && typeof isAccountVerified === "undefined") {
            return res.status(400).json({ success: false, message: "Nothing to update." });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (email && email !== user.email) {
            const emailExists = await userModel.findOne({ email });
            if (emailExists) {
                return res.status(409).json({ success: false, message: 'Email already in use.' });
            }
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (typeof emailNotification !== "undefined") user.emailNotification = emailNotification;
        if (typeof isAccountVerified !== "undefined") user.isAccountVerified = isAccountVerified;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User data updated successfully.',
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                emailNotification: user.emailNotification
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const { userId } = req.user;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.email = email;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Email updated successfully.',
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                emailNotification: user.emailNotification
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
