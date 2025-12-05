// routes/auth.js
const express  = require('express');
const bcrypt   = require('bcryptjs');
const passport = require('passport');
const User     = require('../models/User');

const router = express.Router();

// ---------- REGISTER PAGE ----------
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register',
    searchQuery: '',
    error: false
  });
});

// ---------- HANDLE REGISTER ----------
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword
    });

    res.redirect('/login');
  } catch (err) {
    console.error('Error registering user:', err);
    res.redirect('/register');
  }
});

// ---------- LOGIN PAGE ----------
router.get('/login', (req, res) => {
  const showError = req.query.error === '1';
  const nextUrl   = req.query.next || '';

  res.render('login', {
    title: 'Login',
    searchQuery: '',
    error: showError,
    next: nextUrl
  });
});

// ---------- HANDLE LOGIN (DYNAMIC REDIRECT) ----------
router.post('/login', (req, res, next) => {
  const nextUrl = req.body.next || '/';   // default: home page

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // Login failed -> back to login, keep error + next
      const redirectUrl =
        '/login?error=1' + (nextUrl ? '&next=' + encodeURIComponent(nextUrl) : '');
      return res.redirect(redirectUrl);
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      // Login OK -> go to original page (e.g. /create) or home
      return res.redirect(nextUrl || '/');
    });
  })(req, res, next);
});

// ---------- LOGOUT ----------
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});

module.exports = router;

