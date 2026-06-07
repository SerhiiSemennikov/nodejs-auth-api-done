import { todosService } from '../services/todosService.js';

async function getAllTodos(req, res, next) {
  const user = await todosService.getUserByRefreshToken(
    req.headers.cookie.split('=')[1],
  );
  console.log('userIdByRefreshFromHeadersCookie', user.userId);
  const todos = await todosService.getAllActiveTodos(user.userId);

  res.send(todos.map(todosService.normalizeTodo));
}

async function getAllUserTodos(req, res, next) {
  const { id } = req.params;
  console.log('getAllUserTodos userId', id);
  try {
    const todos = await todosService.getAllActiveTodos(+id);

    res.send(todos.map(todosService.normalizeTodo));
  } catch (err) {
    console.error('Error fetching user todos:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function postTodo(req, res, next) {
  const { userId, title, completed } = req.body;
  console.log('Received POST /todos with body:', req.body);
  const todos = await todosService.getAllActiveTodos(+userId);
  try {
    // Basic validation
    if (typeof title !== 'string' || title.trim() === '') {
      return res
        .status(400)
        .json({ error: 'Title is required and must be a non-empty string.' });
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
      return res
        .status(400)
        .json({ error: 'Completed must be a boolean if provided.' });
    }
    if (
      todos.some(
        t =>
          t.title.toLowerCase() === title.trim().toLowerCase() &&
          t.userId === userId,
      )
    ) {
      return res.status(400).json({
        error: 'A todo with this title already exists for this user.',
      });
    }
    const allTodos = await todosService.getAllTodos();
    // Create new todo
    const newTodo = {
      id: allTodos.length > 0 ? Math.max(...allTodos.map(t => t.id)) + 1 : 1,
      userId: userId,
      title: title.trim(),
      completed: completed ?? false,
    };

    await todosService.createTodo(newTodo);

    // Respond with the created todo
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newTodo));
  } catch (err) {
    console.error('Error creating todo:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
async function deleteTodo(req, res, next) {
  const { id } = req.params;
  console.log('Deleting todo with ID:', id);

  try {
    const todo = await todosService.getTodoById(+id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    await todosService.deleteTodo(+id);
    res.sendStatus(204);

    res.end();
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
async function patchTodo(req, res, next) {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const todo = await todosService.getTodoById(+id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    const updatedTodo = await todosService.patchTodo(+id, { title, completed });

    res.send(todosService.normalizeTodo(updatedTodo));
  } catch (err) {
    console.error('Error patching todo:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

async function updateTodo(req, res, next) {
  const { id } = req.params;
  const { title, completed } = req.body;

  const updatedTodo = await todosService.updateTodo(+id, { title, completed });
  res.send(todosService.normalizeTodo(updatedTodo));
}

export const todosController = {
  getAllTodos,
  getAllUserTodos,
  postTodo,
  deleteTodo,
  patchTodo,
  updateTodo,
};
