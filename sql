-- ─────────────────────────────────────────
-- 1. USERS  (mirrors auth.users concept)
-- ─────────────────────────────────────────
CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(50)  UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────
-- 2. PROFILES
-- ─────────────────────────────────────────
CREATE TABLE profiles (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNIQUE NOT NULL,
  full_name    VARCHAR(100),
  avatar_char  CHAR(1),
  joined_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- 3. SURVEYS
-- ─────────────────────────────────────────
CREATE TABLE surveys (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  profile_id   INT NOT NULL,
  answers_json TEXT,
  taken_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- 4. RECOMMENDATIONS
-- ─────────────────────────────────────────
CREATE TABLE recommendations (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  profile_id   INT NOT NULL,
  content      TEXT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- 5. HABITS
-- ─────────────────────────────────────────
CREATE TABLE habits (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  profile_id   INT NOT NULL,
  name         VARCHAR(100) NOT NULL,
  category     VARCHAR(50),
  enabled      TINYINT(1) DEFAULT 1,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- 6. HABIT_LOGS
-- ─────────────────────────────────────────
CREATE TABLE habit_logs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  habit_id     INT NOT NULL,
  logged_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  value        FLOAT,
  note         TEXT,
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- 7. HABIT_SESSIONS
-- ─────────────────────────────────────────
CREATE TABLE habit_sessions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  habit_id     INT NOT NULL,
  start_time   DATETIME NOT NULL,
  end_time     DATETIME,
  duration_min INT,
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────
-- 8. HABIT_TRENDS
-- ─────────────────────────────────────────
CREATE TABLE habit_trends (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  habit_id     INT NOT NULL,
  week_start   DATE NOT NULL,
  avg_value    FLOAT,
  streak_days  INT DEFAULT 0,
  FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);