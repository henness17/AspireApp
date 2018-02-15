module.exports = function(app){
  require('./passport.js')(app);
  var connect = process.env.PG_CONNECT;
  var pg = require('pg'),
      bodyParser = require('body-parser'),
      path = require('path');
  pg.defaults.ssl = true;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false}));

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

  var GetUserCarOutputById = function GetUserCarOutputById(socialId, callback){
    pg.connect(connect, function(err, client, done){
      client.query("SELECT * FROM public.user_transportation WHERE social_id=$1", [socialId], function(err, result){
        done();
        callback(result);
      }); 
    });
  };
  module.exports.GetUserCarOutputById = GetUserCarOutputById;

  var GetUserBySocialId = function GetUserBySocialId(socialId, callback){
    pg.connect(connect, function(err, client, done){
      client.query("SELECT * FROM public.user WHERE social_id=$1", [socialId], function(err, result){
        done();
        callback(result);
      }); 
    });
  };
  module.exports.GetUserBySocialId = GetUserBySocialId;

  var GetUserSettingsBySocialId = function GetUserSettingsBySocialId(socialId, callback){
    pg.connect(connect, function(err, client, done){
      client.query("SELECT * FROM public.user_transportation WHERE social_id=$1", [socialId], function(err, result){
        done();
        callback(result);
      }); 
    });
  };
  module.exports.GetUserSettingsBySocialId = GetUserSettingsBySocialId;
 
  var PostUserBySocialId = function PostUserBySocialId(socialId, callback){
    pg.connect(connect, function(err, client, done){
      client.query("INSERT INTO public.user (social_id) VALUES ($1)", [socialId], function(err, result){
        done();
        callback();
      }); 
    });
  };
  module.exports.PostUserBySocialId = PostUserBySocialId;

  var PostUserSettingsBySocialId = function PostUserSettingsBySocialId(socialId, callback){
    pg.connect(connect, function(err, client, done){
      client.query("INSERT INTO public.user_transportation (social_id) VALUES ($1)", [socialId], function(err, result){
        done();
        callback();
      }); 
    });
  };
  module.exports.PostUserSettingsBySocialId = PostUserSettingsBySocialId;

  var PostUserTransportationSettings = function PostUserTransportationSettings(socialId, formResults, callback){
    pg.connect(connect, function(err, client, done){
      GetUserSettingsBySocialId(socialId, callback2);
      function callback2(result){
        if(result.rows.length == 0){
          PostUserSettingsBySocialId(socialId, updateSettings);
        }else{
          
          updateSettings();
        }
        function updateSettings(){
          client.query("UPDATE public.user_transportation SET " +
                      "year=$1,make=$2,model=$3,transmission=$4,engine=$5,aspiration=$6,car_output=$7 WHERE social_id=$8", 
            [formResults.year,
             formResults.make,
             formResults.model,
             formResults.transmission,
             formResults.engine,
             formResults.aspiration,
             formResults.car_output,
             socialId], function(err, result){
            done();
            callback();
          }); 
        }
      }
    });
  };
  module.exports.PostUserTransportationSettings = PostUserTransportationSettings;
};