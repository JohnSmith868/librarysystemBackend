var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressjwt = require('express-jwt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var booksearchRouter = require('./routes/booksearch');
var userbookingRouter = require('./routes/userbooking');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//cross domain accept
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
//jwt token authen
app.use(expressjwt({
  secret:"goodmorning"
}).unless({
  path:[
    '/',
    '/:id',
    '/login',
    '/register',
    '/books',
    /^\/books\/.*/,
  ]
}));
app.use(function (err, req, res, next) {

  if (err.name === 'UnauthorizedError') {

      res.status(401).send('invalid token...');
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login',loginRouter);
app.use('/register',registerRouter);
app.use('/books',booksearchRouter);
app.use('/books/:bookid',booksearchRouter);
app.use('/userbooking',userbookingRouter);
app.use('/userbooking/:appointmentid',userbookingRouter);


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

module.exports = app;
