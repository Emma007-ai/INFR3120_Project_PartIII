// Load environment variables from .env
require('dotenv').config();

var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');

const mongoose    = require('mongoose');
const session     = require('express-session');
const passport    = require('passport');
const cors        = require('cors');           // <-- NEW
const apiRouter   = require('./routes/api');   // <-- NEW

// Passport config
require('./config/passport')(passport);

// ----- MongoDB (Mongoose) setup -----
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter  = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ----- CORS for front-end (Netlify/Render) -----
// This is simple and open; fine for a course project.
app.use(cors());

// ----- SESSION + PASSPORT -----
app.use(
  session({
    secret: 'super-secret-key-change-this',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Make logged-in user available in all EJS views as `user`
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// ----- ROUTES -----
// Auth routes: /login, /register, /logout
app.use('/', authRouter);

// Site routes (EJS views)
app.use('/', indexRouter);
app.use('/users', usersRouter);

// API routes (for frontend: /api/recipes, /api/contact, etc.)
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

