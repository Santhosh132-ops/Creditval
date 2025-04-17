const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load environment variables from .env
const path = require('path');


const app = express();
const PORT = 3000;
const mongoUrl = process.env.MONGO_URI;
const dbName = 'creditApp';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from public/

// Serve register.html when user visits root "/"
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));

});


let db;
MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log("✅ MongoDB connected");
  })
  .catch(err => console.error(err));

// Register route
app.post('/api/register', async (req, res) => {
  const { username, email, mobile, password } = req.body;
  const existingUser = await db.collection('users').findOne({ username });
  if (existingUser) return res.status(400).json({ message: 'User exists' });

  const hashed = await bcrypt.hash(password, 10);
  await db.collection('users').insertOne({ username, email, mobile, password: hashed });
  res.json({ message: 'Registered successfully' });
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.collection('users').findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid email' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Incorrect password' });

  res.json({ message: 'Login successful', user: email });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
