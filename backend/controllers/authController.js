import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";



export const register = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({success: false, message: 'Provide all Details'});
    }

    try {
        const existingUser = await userModel.findOne({email});
        if (existingUser) {
            return res.status(409).json({success: false, message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({name, email, password: hashedPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //sending welcome email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to TaskMaster',
            text: `Welcome to TaskMaster Web App. Your account has been created with email id: ${email}`,
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                    <h2 style="color: #4CAF50;">Welcome to TaskMaster! 🎉</h2>
                    <p style="font-size: 16px; color: #333;">
                        Your account has been successfully created with the email: <strong>${email}</strong>
                    </p>
                    <p style="font-size: 16px; color: #333;">
                        We're excited to have you on board. Start organizing your tasks, boosting your productivity, and taking control of your time — one task at a time.
                    </p>
                    <p style="margin-top: 30px; font-size: 14px; color: #888;">
                        — The TaskMaster Team
                    </p>
                    </div>
                `
        };

        await transporter.sendMail(mailOption);

        return res.status(201).json({success: true, message: "Registration successful"});
        
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};


export const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({success: false, message: 'Email and password are required'});
    }

    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(401).json({success: false, message: 'Invalid email'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({success: false, message: 'Invalid password'});
        }
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true, message: 'Logged in successfully'});

    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({success: true, message: 'Logged Out'});

    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

// Send Verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const {userId} = req.user;
        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.status(400).json({success: false, message: "Account Already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #e0e0e0;">
                    <h2 style="color: #4CAF50;">Account Verification</h2>
                    <p style="font-size: 16px; color: #333;">Hi ${user.name || 'there'},</p>
                    <p style="font-size: 16px; color: #333;">
                        Thank you for signing up with <strong>TaskMaster</strong>! Please use the following OTP to verify your account:
                    </p>
                    <div style="font-size: 24px; font-weight: bold; color: #ffffff; background-color: #4CAF50; padding: 10px 20px; display: inline-block; border-radius: 6px; letter-spacing: 2px;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #555; margin-top: 20px;">
                        This OTP is valid for 24 hours only. Do not share it with anyone.
                    </p>
                    <p style="font-size: 14px; color: #888; margin-top: 30px;">
                        — The TaskMaster Team
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOption);
        return res.json({success: true, message: 'Verification OTP Sent on Email'});

    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

// Verify Email using otp
export const verifyEmail = async (req, res) => {
    const {otp} = req.body;
    const {userId} = req.user;

    if(!userId || !otp){
        return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Email verified successfully'});
        
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' })
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({ success: false, message: 'User not found'});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password id ${otp}. Use this OTP to proceed with resetting your password.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                    <h2 style="color: #f44336;">Password Reset Request</h2>
                    <p style="font-size: 16px; color: #333;">
                        Hi ${user.name || 'there'},
                    </p>
                    <p style="font-size: 16px; color: #333;">
                        You requested to reset your password. Use the OTP below to proceed:
                    </p>
                    <div style="font-size: 24px; font-weight: bold; color: #ffffff; background-color: #f44336; padding: 12px 24px; display: inline-block; border-radius: 6px; letter-spacing: 2px; margin: 10px 0;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #555;">
                        This OTP is valid for 15 minutes only. Do not share it with anyone.
                    </p>
                    <p style="font-size: 14px; color: #888; margin-top: 30px;">
                        — The TaskMaster Team
                    </p>
                </div>
            `
        }

        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: 'OTP send to your email'});

    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

// Verify otp 
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP Expired' });
        }

        return res.json({ success: true, message: 'OTP verified successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

// Reset User Password
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.status(400).json({ success: false, message: 'Email, OTP and new password are required' });
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'OTP Expired' });            
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully' });
        
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

// Change Password
export const changePassword = async (req, res) => {
    const { password, newPassword } = req.body;
    const { userId } = req.user;

    if(!password || !newPassword){
        return res.status(400).json({ success: false, message: 'Both current and new password are required.' });
    }

    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect current password.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        return res.json({ success: true, message: 'Password updated successfully.' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message});
    }
}