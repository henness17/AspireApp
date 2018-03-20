module.exports = function(app){
  require('./passport.js')(app);
  var connect = process.env.PG_CONNECT;
  var pg = require('pg'),
      bodyParser = require('body-parser'),
      path = require('path');
  pg.defaults.ssl = true;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false}));

  var GetAllUserIds = function GetAllUserIds(callback){
    pg.connect(connect, function(err, client, done){
      client.query("SELECT * FROM public.user", function(err, result){
        console.log(result);
        done();
        callback(result);
      });    
    });
  };
  module.exports.GetAllUserIds = GetAllUserIds;

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

  var GetUserRecentsById = function GetUserRecentsById(socialId, callback){
    pg.connect(connect, function(err, client, done){
        var query = "(SELECT 'time' as option, ROW_NUMBER() OVER (ORDER BY datetime) AS row, MATERIAL, WASTE_METHOD FROM public.user_foodrecycle_savings WHERE social_id=$1 ORDER BY datetime DESC LIMIT 5)"
                    + "UNION" +
                    "(SELECT 'popularity' as option, COUNT(*) as row, MATERIAL, WASTE_METHOD FROM public.user_foodrecycle_savings WHERE social_id=$1 GROUP BY MATERIAL, WASTE_METHOD ORDER BY row DESC LIMIT 5)"; 
      client.query(query, [socialId], function(err, result){
        done();
        var recents = {"popularity":[],"time":[]};
        result.rows.forEach(element => {
            var newArr = {"material":element.material, "waste_method":element.waste_method};
            if(element.option == "popularity"){
                recents.popularity.push(newArr);
            }else if(element.option == "time"){
                recents.time.push(newArr);
            }
        });

        callback(JSON.stringify(recents));
        
      });
    });
  };
  module.exports.GetUserRecentsById = GetUserRecentsById;

  var GetUserSettingsBySocialId = function GetUserSettingsBySocialId(socialId, callback){
    pg.connect(connect, function(err, client, done){
      client.query("SELECT * FROM public.user_transportation WHERE social_id=$1", [socialId], function(err, result){
        done();
        callback(result);
      }); 
    });
  };
  module.exports.GetUserSettingsBySocialId = GetUserSettingsBySocialId;

  var GetUserTotalSavingsById = function GetUserTotalSavingsById(socialId, callback){
    pg.connect(connect, function(err, client, done){
      client.query("SELECT * FROM public.user WHERE social_id=$1", [socialId], function(err, result){
        console.log("Queried total savings by id");
        done();
        callback(result.rows[0].total_savings);
      }); 
    });
  }
  module.exports.GetUserTotalSavingsById = GetUserTotalSavingsById;
 
  var PostUserBySocialId = function PostUserBySocialId(socialId, callback){
    pg.connect(connect, function(err, client, done){
      client.query("INSERT INTO public.user (social_id) VALUES ($1)", [socialId], function(err, result){
        client.query("INSERT INTO public.user_foodrecycle_savings (social_id) VALUES ($1)", [socialId], function(err, result){
          done();
          callback();
        });
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

  var PostUserFoodRecycle = function PostUserFoodRecycle(socialId, formResults, callback){
    pg.connect(connect, function(err, client, done){
      client.query("INSERT INTO public.user_foodrecycle_savings (social_id,type,material,waste_method,quantity,savings) VALUES ($1,$2,$3,$4,$5,$6)", 
      [socialId,
        formResults.type,
        formResults.material,
        formResults.waste_method,
        formResults.quantity,
        formResults.emissions], function(err, result){
          done();
          callback();
      }); 
    });
  };
  module.exports.PostUserFoodRecycle = PostUserFoodRecycle;

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

  var PostUserTransportation = function PostUserTransportation(socialId, formResults, callback){
    var date = new Date();
    pg.connect(connect, function(err, client, done){
      client.query("INSERT INTO public.user_savings (social_id,type,saved,worst_case) VALUES ($1,$2,$3,$4)", 
      [socialId,
        formResults.type,
        formResults.saved,
        formResults.worst_case], function(err, result){
          done();
          callback(formResults);
        }); 
    });
  };
  module.exports.PostUserTransportation = PostUserTransportation;

  var UpdateAddUserTotalSavings = function UpdateAddUserTotalSavings(socialId, addition, callback){
    pg.connect(connect, function(err, client, done){
      GetUserTotalSavingsById(socialId, callback2);
      function callback2(savings){
        var newSavings = parseFloat(savings) + parseFloat(addition);
        var newSavings = newSavings.toFixed(2);
        client.query("UPDATE public.user SET total_savings=$1 WHERE social_id=$2", [newSavings, socialId], 
          function(err, result){
            console.log("Updated total savings by id");
              done();
              callback();
          }); 
      }
    });
  }
  module.exports.UpdateAddUserTotalSavings = UpdateAddUserTotalSavings;
};