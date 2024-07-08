var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ulsaRouter = require('./routes/ulsa');
const authRouter = require('./routes/auth')

// info db
const databaseURL = "mongodb+srv://ibarraorvil:Sooth0212@cluster0.dh71ixn.mongodb.net/ulsa"
mongoose.connect(databaseURL);
mongoose.connection.on('open', function(){
  console.log("Connection OK")

});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ulsa', ulsaRouter);
app.use('/auth',authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
module.exports = app;

