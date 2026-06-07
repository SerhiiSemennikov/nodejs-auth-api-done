import express from 'express';
import { todosController } from '../controllers/todosController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { catchError } from '../middlewares/catchError.js';


export const todosRouter = new express.Router();
//todosRouter.get(
 // '/',
 // catchError(authMiddleware),
 // catchError(todosController.getAllTodos),
//);
todosRouter.post(
  '/',
  catchError(authMiddleware),
  catchError(todosController.postTodo),
);
todosRouter.delete('/:id',
  catchError(authMiddleware),
  catchError(todosController.deleteTodo),
);
todosRouter.put('/:id',
  catchError(authMiddleware),
  catchError(todosController.updateTodo),
);
todosRouter.patch('/:id',
  catchError(authMiddleware),
  catchError(todosController.patchTodo),
);