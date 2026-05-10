// server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors({ origin: '*' })); // tighten in production
app.use(express.json());

app.use('/api/auth',   require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

