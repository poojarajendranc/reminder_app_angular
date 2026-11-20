import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { login, logout, refresh, register } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);


router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({
    statusCode: 200,
    success: true,
    message: 'Authenticated user retrieved successfully',
    data: req.user,
  });
});

export default router;