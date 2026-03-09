const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'NENA-APP Backend API is running' });
});

// Component Routes
app.use('/api/auth', require('./components/auth/routes/authRoutes'));
app.use('/api/roles', require('./components/auth/routes/rolesRoutes'));
app.use('/api/feed', require('./components/feed/routes/feedRoutes'));
app.use('/api/study', require('./components/study/routes/studyRoutes'));
app.use('/api/communication', require('./components/communication/routes/messageRoutes'));
app.use('/api/calendar', require('./components/calendar/routes/calendarRoutes'));
app.use('/api/media', require('./components/media-content/routes/podcastRoutes'));
app.use('/api/rooms', require('./components/rooms/routes/roomRoutes'));
app.use('/api/dashboard', require('./components/dashboard/routes/dashboardRoutes'));
app.use('/api/notifications', require('./components/notifications/routes/notificationRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
