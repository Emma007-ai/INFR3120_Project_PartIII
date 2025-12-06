const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe'); // adjust if your model name differs

router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(10);
    const cleaned = recipes.map(r => ({
      id: r._id,
      name: r.name,
      description: r.description,
      category: r.category,
      createdAt: r.createdAt,
    }));
    res.json(cleaned);
  } catch (err) {
    console.error('Error /api/recipes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
