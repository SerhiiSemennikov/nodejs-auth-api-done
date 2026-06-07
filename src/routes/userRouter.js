import express from 'express';
import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { catchError } from '../middlewares/catchError.js';
import { todosController } from '../controllers/todosController.js';
import { todosService } from '../services/todosService.js';

export const userRouter = new express.Router();

userRouter.get(
  '/',
  catchError(authMiddleware),
  catchError(userController.getAll),
);
userRouter.get(
  '/:id',
  catchError(authMiddleware),
  catchError(userController.getById),
);
userRouter.get(('/:id/todos'),
  catchError(authMiddleware),
  catchError(todosController.getAllUserTodos),
);





