const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport')
const session = require('express-session')

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

// ---------------------------------------------------------------------------------
// Engine setup
// ---------------------------------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// ---------------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'oh-boy-oh-boy',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// ---------------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------------
app.use('/', indexRouter);
app.use('/auth', authRouter);


// ---------------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------------

//If we made it this far, none of our routes were triggered, so it is a 404
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
