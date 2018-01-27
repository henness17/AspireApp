module.exports = function(app){
	// routes must include passport
	require('./passport.js')(app);
  var bodyParser = require('body-parser'),
  path = require('path');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false}));

  // Application root route page, aspireapp.herokuapp.com/
  app.get('/', loggedIn, function(req, res){
    res.send('Hello World!');
  });

  app.get('/login', function(req, res){
    res.render('login', {user: req.user});
  });

  app.get('/map', loggedIn, function(req, res){
    res.render('login', {user: req.user});
  });

  app.get('/settings', function(req, res){
    res.render('settings', {user: req.user});
  });

  function loggedIn(req, res, next) {
    if (req.user) {
      console.log(req.user);
      next();
    } else {
      console.log(req.user);
      res.redirect('/login');
    }
  }
}