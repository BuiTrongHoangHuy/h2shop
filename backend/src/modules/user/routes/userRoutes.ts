import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../../auth/middleware/authenticate';
import { authorize } from '../../auth/middleware/authorize';
import { container } from '../../../container';
import { TYPES } from '../../../types';
import { IUserService } from '../services/IUserService';

const userRouter = () => {
  const router = Router();
  const userService = container.get<IUserService>(TYPES.IUserService);
  const userController = new UserController(userService);

  // Get current user profile (authenticated users)
  router.get('/profile', authenticate, (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    return userController.getUserById({ params: { id: userId } } as any, res);
  });

  router.put('/profile', authenticate, (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    return userController.updateUser({ params: { id: userId }, body: req.body } as any, res);
  });

  router.use(authenticate, authorize(['admin']));

  router.get('/', (req, res) => userController.getAllUsers(req, res));

  router.get('/:id', (req, res) => userController.getUserById(req, res));

  router.get('/phone/:phone', (req, res) => userController.getUserByPhone(req, res));

  router.post('/', (req, res) => userController.createUser(req, res));

  router.put('/:id', (req, res) => userController.updateUser(req, res));

  router.delete('/:id', (req, res) => userController.deleteUser(req, res));

  return router;
};

export default userRouter; 