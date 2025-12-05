// routes/index.js
const express = require('express');
const router  = express.Router();

const Recipe = require('../data/recipes');

// ---------- AUTH GUARD ----------
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Not logged in -> remember where they were trying to go
  const nextUrl = encodeURIComponent(req.originalUrl || '/');
  return res.redirect('/login?next=' + nextUrl);
}

// ---------- HOME + SEARCH + VIEW MODE ----------
router.get('/', async (req, res) => {
  try {
    const searchQuery = (req.query.q || '').trim();
    const viewMode    = (req.query.view || 'dashboard').toLowerCase();

    let recipes = [];

    // Only load recipes if the user is logged in
    if (req.isAuthenticated && req.isAuthenticated()) {
      if (searchQuery.length > 0) {
        const regex = new RegExp(searchQuery, 'i');
        recipes = await Recipe.find({
          user: req.user._id, // only this user's recipes
          $or: [
            { name: regex },
            { ingredients: regex },
            { notes: regex }
          ]
        }).sort({ createdAt: -1 });
      } else {
        recipes = await Recipe.find({
          user: req.user._id // only this user's recipes
        }).sort({ createdAt: -1 });
      }
    }

    res.render('index', {
      title: 'RecipeCraft',
      recipes,
      searchQuery,
      viewMode
    });
  } catch (err) {
    console.error('Error loading recipes:', err);
    res.render('index', {
      title: 'RecipeCraft',
      recipes: [],
      searchQuery: '',
      viewMode: 'dashboard',
      error: 'Could not load recipes right now.'
    });
  }
});

// ---------- CREATE (PROTECTED) ----------
router.get('/create', ensureAuth, (req, res) => {
  res.render('create', {
    title: 'Create Recipe',
    searchQuery: ''
  });
});

router.post('/create', ensureAuth, async (req, res) => {
  try {
    const newRecipe = {
      user: req.user._id, // tie recipe to logged-in user
      name: req.body.name,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      time: req.body.time,
      equipment: req.body.equipment,
      image: req.body.image,
      notes: req.body.notes
    };

    await Recipe.create(newRecipe);
    res.redirect('/');
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.redirect('/');
  }
});

// ---------- EDIT (PROTECTED + OWNER ONLY) ----------
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      user: req.user._id // must belong to this user
    });

    if (!recipe) return res.redirect('/');

    res.render('edit', {
      title: 'Edit Recipe',
      recipe,
      searchQuery: ''
    });
  } catch (err) {
    console.error('Error loading recipe for edit:', err);
    res.redirect('/');
  }
});

router.post('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const updated = {
      name: req.body.name,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      time: req.body.time,
      equipment: req.body.equipment,
      image: req.body.image,
      notes: req.body.notes
    };

    await Recipe.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // only update your own
      updated
    );

    res.redirect('/');
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.redirect('/');
  }
});

// ---------- DELETE (PROTECTED + OWNER ONLY) ----------
router.post('/delete/:id', ensureAuth, async (req, res) => {
  try {
    await Recipe.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id // only delete your own
    });

    res.redirect('/');
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.redirect('/');
  }
});

// ---------- READ-ONLY VIEW ONE RECIPE (PROTECTED + OWNER ONLY) ----------
router.get('/view/:id', ensureAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      user: req.user._id // must belong to this user
    });

    if (!recipe) return res.redirect('/?view=list');

    res.render('recipe-view', {
      title: recipe.name ? `${recipe.name} | View Recipe` : 'View Recipe',
      searchQuery: '',
      recipe
    });
  } catch (err) {
    console.error('Error viewing recipe:', err);
    res.redirect('/?view=list');
  }
});

// ---------- ABOUT (PUBLIC) ----------
router.get('/about', async (req, res) => {
  try {
    let recipes = [];

    if (req.isAuthenticated && req.isAuthenticated()) {
      recipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    res.render('about', {
      title: 'About RecipeCraft',
      searchQuery: '',
      recipes
    });
  } catch (err) {
    console.error('Error loading recipes for about page:', err);

    res.render('about', {
      title: 'About RecipeCraft',
      searchQuery: '',
      recipes: []
    });
  }
});

// ---------- CONTACT (PUBLIC) ----------
router.get('/contact', async (req, res) => {
  try {
    const sent = req.query.sent === '1';
    let recipes = [];

    if (req.isAuthenticated && req.isAuthenticated()) {
      recipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });
    }

    res.render('contact', {
      title: 'Contact RecipeCraft',
      searchQuery: '',
      submitted: sent,
      recipes
    });
  } catch (err) {
    console.error('Error loading recipes for contact page:', err);

    res.render('contact', {
      title: 'Contact RecipeCraft',
      searchQuery: '',
      submitted: false,
      recipes: []
    });
  }
});

router.post('/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.redirect('/contact?sent=1');
});

module.exports = router;


