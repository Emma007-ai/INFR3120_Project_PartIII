const express = require('express');
const router = express.Router();

const Recipe = require('../models/Recipe');
const ContactMessage = require('../models/ContactMessage');

/* ======================================================
   GET /api/recipes  
   Public endpoint for the frontend (Home page)
====================================================== */
router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const cleaned = recipes.map(r => ({
      id: r._id,
      name: r.name,
      description: r.description || "",
      category: r.category || "",
      createdAt: r.createdAt,
    }));

    res.json(cleaned);
  } catch (err) {
    console.error('Error /api/recipes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ======================================================
   POST /api/contact  
   Save contact form submissions from FRONTEND
====================================================== */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, reason, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !reason || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required.'
      });
    }

    // Save to database
    await ContactMessage.create({
      name,
      email,
      reason,
      subject,
      message
    });

    return res.json({ success: true });

  } catch (err) {
    console.error('Error /api/contact:', err);
    return res.status(500).json({
      success: false,
      error: 'Server error.'
    });
  }
});

module.exports = router;

