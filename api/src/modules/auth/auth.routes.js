import express from 'express'
import { registerUser, loginUser,logoutUser } from './auth.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';
import roleMiddleware from '../../middlewares/role.middleware.js';

const router = express.Router();

router.post('/register', registerUser );
router.post('/login', loginUser);
router.post('/logout', authMiddleware,logoutUser);
router.get('/me',authMiddleware,function(req,res){
    res.status(201).json({message: 'Authenticated user', user: req.user})
   });

export default router;