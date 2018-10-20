var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var logger = require('morgan');
var jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var homepageRouter = require('./routes/homepage');
var militaryRouter = require('./routes/militaryNews');
var docRouter = require('./routes/doc');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// token校验
app.use((req, res, next) => {
	const {
		token
	} = req.cookies;
	try {
	  let decoded = jwt.verify(token, 'secret');
	//   console.log('decoded',decoded)
	  next()
	} catch(err) {
	  if(req.url.indexOf('login')===-1){
		  res.send({status:'4001',msg:'token过期啦~'})
		  // res.redirect('/login')
		}else{
			next()
	  	}
	}
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/homepage', homepageRouter);
app.use('/login', loginRouter);
app.use('/militaryNews', militaryRouter);
app.use('/doc', docRouter);

var sessionKeys = [];
for (var i = 0; i < 100; i++) {
	sessionKeys.push('slkdjflskf_' + Math.random() * 10)
}

app.use(cookieSession({
	name: 'seesionId',
	keys: sessionKeys,
	maxAge: 24 * 60 * 60 * 1000
}))
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});


module.exports = app;