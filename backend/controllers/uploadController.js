import multer from "multer";
import { bucket } from "../config/firebaseAdmin.js";
import User from "../models/userModel.js";

// Multer setup (store file in memory)
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({success: false, message: "No file uploaded" });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const fileName = `profilePhotos/${req.user.id}-${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    user.profileImageUrl = publicUrl;
    await user.save();

    res.json({ success: true, message: "Profile photo uploaded successfully", profileImageUrl: publicUrl });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

//Update profile photo (delete old, upload new)
export const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Delete old photo if exists
    if (user.profileImageUrl) {
      const oldFilePath = user.profileImageUrl.split(`/${bucket.name}/`)[1];
      if (oldFilePath) {
        await bucket.file(oldFilePath).delete().catch(() => {
          console.warn("Old file not found, skipping delete.");
        });
      }
    }

    // Upload new photo
    const fileName = `profilePhotos/${req.user.userId}-${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    user.profileImageUrl = publicUrl;
    await user.save();

    res.json({ success: true, message: "Profile photo updated successfully", profileImageUrl: publicUrl });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// Delete profile photo
export const deleteProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.profileImageUrl) {
      return res.status(400).json({ success: false, message: "No profile photo to delete" });
    }

    // Extract file path from URL
    const filePath = user.profileImageUrl.split(`/${bucket.name}/`)[1];
    if (filePath) {
      await bucket.file(filePath).delete().catch(() => {
        console.warn("File not found in storage, skipping delete.");
      });
    }

    // Clear user profileImageUrl
    user.profileImageUrl = null;
    await user.save();

    res.json({ success: true, message: "Profile photo deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
