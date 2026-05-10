


// routes/habits.js
const router = require('express').Router();
const auth   = require('../middleware/auth');
const db     = require('../db');

// Helper: get profile_id for the logged-in user
async function getProfileId(userId) {
  const [[p]] = await db.execute(
    'SELECT id FROM profiles WHERE user_id = ?', [userId]
  );
  return p?.id;
}

// GET all habits
router.get('/', auth, async (req, res) => {
  const profileId = await getProfileId(req.user.userId);
  const [rows] = await db.execute(
    'SELECT * FROM habits WHERE profile_id = ? ORDER BY created_at DESC', [profileId]
  );
  res.json(rows);
});

// POST create habit
router.post('/', auth, async (req, res) => {
  const profileId = await getProfileId(req.user.userId);
  const { name, category } = req.body;
  const [result] = await db.execute(
    'INSERT INTO habits (profile_id, name, category) VALUES (?, ?, ?)',
    [profileId, name, category || null]
  );
  res.json({ id: result.insertId, name, category });
});

// POST log a habit entry
router.post('/:habitId/logs', auth, async (req, res) => {
  const { value, note } = req.body;
  await db.execute(
    'INSERT INTO habit_logs (habit_id, value, note) VALUES (?, ?, ?)',
    [req.params.habitId, value ?? null, note ?? null]
  );
  res.json({ success: true });
});

// GET logs for a habit
router.get('/:habitId/logs', auth, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM habit_logs WHERE habit_id = ? ORDER BY logged_at DESC LIMIT 90',
    [req.params.habitId]
  );
  res.json(rows);
});

// GET trends for a habit
router.get('/:habitId/trends', auth, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM habit_trends WHERE habit_id = ? ORDER BY week_start DESC LIMIT 12',
    [req.params.habitId]
  );
  res.json(rows);
});

module.exports = router;

