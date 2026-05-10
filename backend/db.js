const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     'localhost',
  port:     3306,
  user:     'root',
  password: '#Kenchosum333',
  database: 'spt_tracker',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;