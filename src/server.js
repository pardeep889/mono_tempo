const express = require('express');
const path = require('path');
const app = express();
const apiRoutes = require('./app'); // Assuming this is your API routes

// Serve API routes
app.use('/api', apiRoutes);

// Serve static assets (React build files)
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Tempospace is running on port ${PORT}`);
});
