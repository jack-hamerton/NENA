const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const dbConfig = require('./config/db.config');
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Successfully connected to MongoDB.');
}).catch(err => {
  console.error('Connection error', err);
  process.exit();
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/calendar', require('./routes/calendar.routes'));
app.use('/api/collaboration', require('./routes/collaboration.routes'));
app.use('/api/podcasts', require('./routes/podcast.routes'));
app.use('/api/posts', require('./routes/post.routes'));

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Add your WebSocket event listeners here
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
