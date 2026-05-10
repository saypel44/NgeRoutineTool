// POST save a log entry
router.post('/logs', auth, async (req, res) => {
  const profileId = await getProfileId(req.user.userId);
  const { habitId, habitName, habitIcon, date, duration, unit, startTime, endTime, note } = req.body;
  const [result] = await db.execute(
    'INSERT INTO habit_logs (habit_id, value, note, logged_at) VALUES (?, ?, ?, ?)',
    [habitId, duration, note || null, date]
  );
  res.json({ id: result.insertId });
});

// GET all logs for current user
router.get('/logs', auth, async (req, res) => {
  const profileId = await getProfileId(req.user.userId);
  const [rows] = await db.execute(
    `SELECT hl.* FROM habit_logs hl
     JOIN habits h ON h.id = hl.habit_id
     WHERE h.profile_id = ?
     ORDER BY hl.logged_at DESC LIMIT 500`,
    [profileId]
  );
  res.json(rows);
});

module.exports = router; // ← this line must be LAST