import { Todo } from '../models/Todo.js';
import { User } from '../models/User.js';
import { Token } from '../models/Token.js';
import { ApiError } from '../exceptions/ApiError.js';

export async function getAllActiveTodos(userId) {
  return await Todo.findAll({
    where: { userId },
    order: [['id', 'ASC']],
  });
}
export function normalizeTodo({ id, userId, title, completed }) {
  return { id, userId, title, completed };
}

export function getUserByRefreshToken(refreshToken) {
  return Token.findOne({
    where: { refreshToken },
    include: User,
  });
}

export async function createTodo(todoData) {
  try {
    const existingTodo = await Todo.findOne({
      where: { title: todoData.title, userId: todoData.userId },
    });
    if (existingTodo) {
      throw ApiError.ExistingTodo();
    }
    console.log('Creating todo with data:', todoData);
  } catch (err) {
    console.error('Error checking existing todo:', err);
    throw ApiError.Internal();
  }
  return await Todo.create(todoData);
}

export async function updateTodo(todoId, todoData) {
  try {
  const todo = await Todo.findByPk(todoId);
  if (!todo) {
    throw new Error('Todo not found');
  }
  await todo.update(todoData);
    return todo;
  } catch (err) {
    console.error('Error updating todo:', err);
    throw ApiError.Internal();
  }
}

export async function deleteTodo(todoId) {
  
  try {
  const todo = await Todo.findByPk(todoId);
  if (!todo) {
    throw new Error('Todo not found');
  }
  await todo.destroy();
    return todo;
  } catch (err) {
    console.error('Error deleting todo:', err);
    throw ApiError.Internal();
  }
}

export async function patchTodo(todoId, patchData) {
  try {
  const todo = await Todo.findByPk(todoId);
  if (!todo) {
    throw new Error('Todo not found');
  }
  await todo.update(patchData);
  return todo;
} catch (err) {
  console.error('Error patching todo:', err);
  throw ApiError.Internal();
}
}

export function getAllTodos() {
  return Todo.findAll({
    order: [['id', 'ASC']],
  });
}
export function getTodoById(todoId) {
  return Todo.findByPk(todoId);
}
export const todosService = {
  getAllActiveTodos,
  normalizeTodo,
  getUserByRefreshToken,
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
  patchTodo,
  getTodoById,
};
