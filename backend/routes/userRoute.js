import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { deleteUserAccount, getUserData, updateEmail, updateUserData } from '../controllers/userController.js';
import { deleteProfilePhoto, updateProfilePhoto, uploadProfilePhoto, upload } from '../controllers/uploadController.js';


const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.post('/update-data', userAuth, updateUserData);
userRouter.post('/update-email', userAuth, updateEmail);
userRouter.delete('/delete-account', userAuth, deleteUserAccount);
userRouter.post('/profile-photo',userAuth, upload.single("image"), uploadProfilePhoto);
userRouter.put('/profile-photo',userAuth, upload.single("image"), updateProfilePhoto);
userRouter.delete("/profile-photo", userAuth, deleteProfilePhoto);

export default userRouter;