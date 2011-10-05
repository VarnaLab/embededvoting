
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.
app.use(function(req, res, next){
  // the status option, or res.statusCode = 404
  // are equivalent, however with the option we
  // get the "status" local available as well
  res.render('404', {
    layout: false,
    status: 404,
    // url: req.url,
    title: '404 Error'
  });
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.render('500', {
    layout: false,
    status: err.status || 500,
    error: err,
    title: '500 Error'
  });
});

// Routes

// 404 Error
app.get('/404', function(req, res, next){
  next();
});

// 403 Error
app.get('/403', function(req, res, next){
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
});

// 500 Error
app.get('/500', function(req, res, next){
  next(new Error('keyboard cat!'));
});

app.get('/:pollId?', require("./controllers/poll"));
app.post("/vote", require("./controllers/vote"));

app.listen(9000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
