import pool from './db.js';

export async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT id, email, password_hash, name, role FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function findUserById(id) {
  const result = await pool.query(
    'SELECT id, email, name, role FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}
