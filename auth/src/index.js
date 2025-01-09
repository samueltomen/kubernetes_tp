const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Secret key for JWT (in a real-world scenario, this would be stored securely)
const JWT_SECRET = 'your_jwt_secret_key';

// Mock user database (replace with actual database in production)
const users = [
  { id: '1', username: 'testuser', password: 'password123' }
];

// Current User Route
app.get('/api/users/currentuser', (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.send({ 
      currentUser: { 
        id: payload.id, 
        username: payload.username 
      } 
    });
  } catch (err) {
    res.send({ currentUser: null });
  }
});

// Signout Route
app.post('/api/users/signout', (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('jwt');
  res.send({});
});

// Signin Route (for completeness)
app.post('/api/users/signin', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(400).send({ errors: [{ message: 'Invalid credentials' }] });
  }

  // Create JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );

  // Set JWT as cookie
  res.cookie('jwt', token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 3600000, // 1 hour
    sameSite: 'strict'
  });

  res.status(200).send(user);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});

// Event handling (if needed in future)
app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);
  res.send({});
});
