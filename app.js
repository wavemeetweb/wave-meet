const express = require('express');
const path = require('path');

const app = express();

// Serve static files from 'public' folder (index.html, CSS, frontend JS)
app.use(express.static(path.join(__dirname, 'public')));

// Optionally setup backend API routes here
// For now, just serve frontend files

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Wave Meet server running on port ${port}`);
});
