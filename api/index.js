const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Proxy endpoint for OMDB API
app.get('/api/movies', async (req, res) => {
  try {
    const apiKey = process.env.OMDB_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        Response: "False",
        Error: "Server configuration error: API key is missing"
      });
    }
    
    const { s, t, i } = req.query;
    
    let url = `https://www.omdbapi.com/?apikey=${apiKey}`;
    
    if (s) url += `&s=${encodeURIComponent(s)}`;
    if (t) url += `&t=${encodeURIComponent(t)}`;
    if (i) url += `&i=${encodeURIComponent(i)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching from OMDB API:', error);
    res.status(500).json({
      Response: "False",
      Error: "Failed to fetch movie data"
    });
  }
});

// Serve static files from src directory
app.use(express.static('src'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Export for Vercel
module.exports = app;