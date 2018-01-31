module.exports = function(app){
	// routes must include passport
	require('./passport.js')(app);
  var postgres = require('./postgres.js');
  var bodyParser = require('body-parser'),
  path = require('path'),
  fs = require("fs");;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false}));

  // Application root route page, aspireapp.herokuapp.com/
  app.get('/', loggedIn, function(req, res){
    res.render('home', {user: req.user});
  });

  app.get('/login', function(req, res){
    res.render('login', {user: req.user});
  });

  app.get('/map', loggedIn, function(req, res){
    res.render('map', {user: req.user});
  });

  app.get('/settings', loggedIn, function(req, res){
    // JSON data example
    var transportationData = fs.readFileSync("data/transportation.json");
    var transportationJson = JSON.parse(transportationData);
    res.render('settings', {user: req.user, transportationJson: transportationJson});
  });

  // This forwards the request route to postgres.js, and then returns when the postgres.js route calls callback()
  app.get('/get-user-by-id', function(req, res){
    postgres.GetUserById(1, callback);
    function callback(){
      res.redirect('/');
    }
  });

  function loggedIn(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/login');
    }
  }
}