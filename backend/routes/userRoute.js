import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { deleteUserAccount, getUserData, updateEmail, updateUserData } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.post('/update-data', userAuth, updateUserData);
userRouter.post('/update-email', userAuth, updateEmail);
userRouter.delete('/delete-account', userAuth, deleteUserAccount);

export default userRouter;