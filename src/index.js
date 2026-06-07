import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import {
  getAllTodos,
  createTodo,
  getAllActiveTodos,
} from './services/todosService.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/authRouter.js';
import { userRouter } from './routes/userRouter.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { Todo } from './models/Todo.js';
import { User } from './models/User.js';
import { todosController } from './controllers/todosController.js';
import { todosRouter } from './routes/todosRouter.js';

const app = express();
const PORT = process.env.PORT || 5000; // default port 5000
const HOST = process.env.HOST || '127.0.0.1';

 app.use(helmet());
app.use(
  cors({
    tls: { rejectUnauthorized: false },
    origin: process.env.CLIENT_URL,
    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

    statusCode: 200,

    header: 'Access-Control-Allow-Origin: *',
    header: 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH',
    header:
      'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With',
  }),
);
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.json());
  
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  console.log(
    `${req.method} ${req.url} ${req.body ? JSON.stringify(req.body) : ''}`,
  );
  next();
});

app.use(authRouter);
app.use('/users', userRouter);
app.use('/todos', todosRouter);
/*app.get('/todos', async (req, res) => {
  const userId = parseInt(req.query.userId);
 
  const checkUser = await User.findByPk(userId);
  if (!checkUser) {
    return res.status(404).json({ error: 'User not found.' });
  }
  const checkUserByEmail = await User.findOne({ where: { email: checkUser.email } });
  if (!checkUserByEmail) {
    return res.status(404).json({ error: 'User not found by email.' });
  }

  try {
    // const allTodos = await getAllActiveTodos(userId);
    const allTodos = await getAllActiveTodos(checkUserByEmail.id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(allTodos));
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});*/

/*app.post('/todos', async (req, res) => {
  console.log('Received POST /todos with body:', req.body);
  try {
    const { title, userId } = req.body;
    const newTodo = {
      id: await Todo.max('id').then(maxId => (maxId || 0) + 1),
      title,
      userId,
      completed: false,
    };

    await createTodo(newTodo);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newTodo));
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});*/

app.options('/todos', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // "localhost:5173"
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.writeHead(200);
  res.end();
});

/*app.patch('/todos/:id', async (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const { title, completed } = req.body;
    const todo = await Todo.findByPk(todoId);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }
    await todo.update({ title, completed });
    res.json(todo);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});*/
/*
app.put('/todos/:id', async (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const { title, completed } = req.body;
    const todo = todos.find(t => t.id === todoId);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }
    // Update the todo
    const index = todos.findIndex(t => t.id === todoId);
    todos[index] = {
      ...todo,
      title: title ?? todo.title,
      completed: completed ?? todo.completed,
    };

    await replaceTodo(todoId, todos[index]);
    todos[index] = { ...todos[index], id: todoId };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(todos[index]));
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
*/
/*app.delete('/todos/:id', async (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const todo = await Todo.findByPk(todoId);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }
    await todo.destroy();
    res.json({ message: 'Todo deleted successfully.' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});*/
app.use('error', (err, req, res) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});
/*app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});*/



app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Express server running at http://${HOST}:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Press Ctrl+C to stop the server');
});
