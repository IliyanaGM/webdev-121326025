import express from 'express';
import { authenticateUser, getUserById } from '../services/authService.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  let user;
  try {
    const { email, password } = req.body;
    user = await authenticateUser(email, password);
  } catch (err) {
    if (err.message === 'Wrong e-mail or password') {
      return res.status(401).json({ error: 'Wrong e-mail or password' });
    }
    console.error('Login failed:', err);
    return res.status(500).json({ error: 'Server error, please try again' });
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: 'Server error, please try again' });
    }
    req.session.userId = user.id;
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: 'Server error, please try again' });
      }
      res.json({ user });
    });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ status: 'logged_out' });
  });
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error, please try again' });
  }
});

export default router;
