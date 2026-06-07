import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { emailService } from '../services/emailService.js';
import { ApiError } from '../exceptions/ApiError.js';
import { User } from '../models/User.js';
import { Todo } from '../models/Todo.js';


function getAllActive() {
  return User.findAll({
    where: { activationToken: null },
    order: ['id'],
  });
}

function getAllActiveTodos() {
  return Todo.findAll({
    order: [['id', 'ASC']],
  });
}



/*function getAllActive(id) {

  return Todo.findAll({
    where: {
      userId: id,
    },
    order: [['id', 'ASC']],
  });
}*/

function getByEmail(email) {
  return User.findOne({
    where: { email },
  });
}

function normalize({ id, email }) {
  return { id, email };
}
function normalizeTodo({ id, title, userId }) {
  return { id, title, userId };
}

async function register({ email, password }) {
  const existingUser = await getByEmail(email);

  if (existingUser) {
    throw ApiError.BadRequest('Validation error', {
      email: 'Email is already taken',
    });
  }

  const activationToken = uuidv4();
  const hash = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hash,
    activationToken,
  });

  await emailService.sendActivationLink(email, activationToken);
}

export const userService = {
  getAllActive,
  normalize,
  getByEmail,
  register,
  normalizeTodo,
  getAllActiveTodos,
  // getUserByRefreshToken,
};

// uuidv4();
