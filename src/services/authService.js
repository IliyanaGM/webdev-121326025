import bcrypt from 'bcryptjs';
import { findUserByEmail, findUserById } from '../data/userRepository.js';

export async function authenticateUser(email, password) {
  if (!email || !password) {
    throw new Error('Wrong e-mail or password');
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Wrong e-mail or password');
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error('Wrong e-mail or password');
  }

  // Return user object without password_hash
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

export async function getUserById(id) {
  return await findUserById(id);
}
