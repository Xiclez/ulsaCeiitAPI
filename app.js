var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 3200;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ulsaRouter = require('./routes/ulsa');
const authRouter = require('./routes/auth');
const devRouter = require('./routes/dev');

// MongoDB connection
const databaseURL = "mongodb+srv://ibarraorvil:Sooth0212@cluster0.dh71ixn.mongodb.net/ceiit_db";
mongoose.connect(databaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connection established");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Initialize the express app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Routes setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ulsa', ulsaRouter);
app.use('/auth', authRouter);
app.use('/dev', devRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
