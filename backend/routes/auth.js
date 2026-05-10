// routes/auth.js
const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../db');

// SIGNUP
router.post('/signup', async (req, res) => {
  const { username, password, full_name } = req.body;
  if (!username || !password || !full_name)
    return res.status(400).json({ error: 'All fields required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username.toLowerCase(), hash]
    );
    const userId = result.insertId;
    await db.execute(
      'INSERT INTO profiles (user_id, full_name, avatar_char) VALUES (?, ?, ?)',
      [userId, full_name, full_name.charAt(0).toUpperCase()]
    );
    const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, username, full_name });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Username already taken' });
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [[user]] = await db.execute(
      'SELECT u.id, u.username, u.password_hash, p.full_name ' +
      'FROM users u JOIN profiles p ON p.user_id = u.id ' +
      'WHERE u.username = ?',
      [username.toLowerCase()]
    );
    if (!user) return res.status(401).json({ error: 'Incorrect username or password' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Incorrect username or password' });
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.json({ token, username: user.username, full_name: user.full_name });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
