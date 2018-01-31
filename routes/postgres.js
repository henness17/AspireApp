module.exports = function(app){
  require('./passport.js')(app);
  var connect = process.env.PG_CONNECT;
  var pg = require('pg'),
      bodyParser = require('body-parser'),
      path = require('path');
  pg.defaults.ssl = true;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false}));

  // This gets called by pages.js and uses callback to return
  var GetUserById = function GetUserById(id, callback){
    pg.connect(connect, function(err, client, done){
      client.query("SELECT * FROM public.user WHERE id=$1", [id], function(err, result){
        console.log(result);
        done();
        callback();
      }); 
    });
  };
  module.exports.GetUserById = GetUserById;

  // This gets called by pages.js and uses callback to return
  var SetSettings = function SetSettings(formResults, callback){
    pg.connect(connect, function(err, client, done){
      console.log(formResults);
      client.query("UPDATE public.user_transportation SET year=$1 WHERE id=$2", [formResults.yearlist, 1], function(err, result){
        done();
        callback();
      }); 
    });
  };
  module.exports.SetSettings = SetSettings;
};