import { userService } from '../services/userService.js';

async function getAll(req, res, next) {
 //  const user = await userService.getUserByRefreshToken(req.headers.cookie.split('=')[1]);
  
  const users = await userService.getAllActive();
  // const users = await userService.getAllActive(user.userId);

  res.send(users.map(userService.normalize));
}

async function getById(req, res, next) {
  const { id } = req.params;
  
  const users = await userService.getAllActive();
  const user = users.find(u => u.id === +id);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.send(userService.normalize(user));
}

async function getAllById(req, res, next) {
  const { id } = req.params;
  const users = await userService.getAllActive();
  const user = users.find(u => u.id === +id);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.send(userService.normalize(user));
}

export const userController = { getAll, getAllById, getById };
