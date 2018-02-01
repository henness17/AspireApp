module.exports = function(app){
	require('./passport.js')(app);
  var postgres = require('./postgres.js');
  var bodyParser = require('body-parser'),
  path = require('path'),
  fs = require("fs");;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false}));

  app.get('/', isLoggedIn, isRegistered, isSettingsSet, function(req, res){
    res.render('home', {user: req.user});
  });

  app.get('/login', function(req, res){
    res.render('login', {user: req.user});
  });

  app.get('/map', isLoggedIn, isRegistered, isSettingsSet, function(req, res){
    res.render('map', {user: req.user});
  });

  app.get('/settings', isLoggedIn, isRegistered, function(req, res){
    var transportationData = fs.readFileSync("data/transportation.json");
    var transportationJson = JSON.parse(transportationData);
    res.render('settings', {user: req.user, transportationJson: transportationJson});
  });

  app.get('/get-user-by-id', function(req, res){
    postgres.GetUserById(1, callback);
    function callback(){
      res.redirect('/');
    }
  });

  app.post('/set-settings', function(req, res){
    postgres.SetSettings(req.user.id, req.body, callback);
    function callback(){
      res.redirect('/');
    }
  });

  function isLoggedIn(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/login');
    }
  }

  function isRegistered(req, res, next){
    postgres.GetUserBySocialId(req.user.id, callback);
    function callback(result){
      if(result.rows.length == 0){
        postgres.PostUserBySocialId(req.user.id, callback2);
        function callback2(){
          next();
        }
      }else{
        next();
      }
    }
  }

  function isSettingsSet(req, res, next){
    postgres.GetUserSettingsBySocialId(req.user.id, callback);
    function callback(result){
      if(result.rows.length == 0){
        res.redirect('/settings');
      }else{
        next();
      }
    }
  }
}