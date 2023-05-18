const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Routes
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // console.log(username);
  // console.log(password);

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    // console.log(user);
    if (user) {
      // const passwordMatch = await bcrypt.compare(password, user.password);
      // console.log(user.password);
      // console.log(password);
      // console.log(passwordMatch);
      if (password==user.password) {
      // if (passwordMatch) {
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid username or password.' });
      }
    } else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
