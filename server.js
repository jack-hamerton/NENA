const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'frontend/dist' directory
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// API routes
app.use('/api/v1', require('./backend/routes'));

// For any other request, serve the 'index.html' file
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
