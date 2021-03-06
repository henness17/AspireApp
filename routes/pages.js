module.exports = function(app) {
  require("./passport.js")(app);
  var postgres = require("./postgres.js");
  var bodyParser = require("body-parser"),
    path = require("path"),
    fs = require("fs");
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get("/", isLoggedIn, isRegistered, isSettingsSet, function(req, res) {
    followAllUsers(req, res, callback);
    console.log("After follow all users");
    function callback(stream) {
        console.log("Before get savings");
        postgres.GetUserBySocialId(req.user.id, callback2);

        console.log("After get savings");
        function callback2(user) {
            
            var conversion = fs.readFileSync("data/conversions.json");
            res.render("home", {
                user: req.user,
                stream: stream,
                userData: user.rows[0]
            });
        }
    }
  });

  app.get("/login", function(req, res) {
    res.render("login", { user: req.user });
  });

  app.get("/map", isLoggedIn, isRegistered, isSettingsSet, function(req, res) {
    postgres.GetUserCarOutputById(req.user.id, callback);
    function callback(results) {
      var carOutput = results;
      res.render("map", {
        user: req.user,
        carOutput: carOutput
      });
    }
  });

  app.get("/foodrecycle", isLoggedIn, isRegistered, isSettingsSet, function(
    req,
    res
  ) {
    var foodrecycleData = fs.readFileSync("data/foodrecycle.json");
    var foodrecycleJson = JSON.parse(foodrecycleData);
    // Get the user's recents from postgres
    postgres.GetUserRecentsById(req.user.id, callback);
    function callback(recents) {
      res.render("foodrecycle", {
        user: req.user,
        foodrecycleJson: foodrecycleJson,
        recents: recents
      });
    }
  });

  app.get("/settings", isLoggedIn, isRegistered, function(req, res) {
    var transportationData = fs.readFileSync("data/transportation.json");
    var conversionData = fs.readFileSync("data/conversions.json");
    postgres.GetUserSettingsBySocialId(req.user.id, callback);
    function callback(results,results2) {
      var userSettingsJson = {"car_data":results, "conversion": results2};
      res.render("settings", {
        user: req.user,
        transportationJson: transportationData,
        conversionJson: conversionData,
        userSettingsJson: userSettingsJson
      });
    }
  });

  app.get("/get-user-by-id", function(req, res) {
    postgres.GetUserById(1, callback);
    function callback() {
      res.redirect("/");
    }
  });

  app.post("/post-user-foodrecycle", function(req, res) {
    console.log(JSON.stringify(req.body));
    postgres.PostUserFoodRecycle(req.user.id, req.body, callback);
    function callback(formResults) {
      var stream = require("getstream");
        // Instantiate a new client (server side)
        client = stream.connect(
          process.env.STREAM_ID,
          process.env.STREAM_SECRET,
          process.env.STREAM_APP
        );
        var userName = String(req.user.id);
        var user = client.feed("user", userName);
        // User follows everyone
        var userTimeline = client.feed("timeline", userName);
        postgres.GetUserBySocialId(req.user.id, callback);
        function callback(userResults){
          userResults = userResults.rows[0];
          var userSavings = formResults.savings * userResults.conversion_factor;
          var userUnit = userResults.conversion_unit;
          console.log(JSON.stringify(userResults) + "\n\n\n\n\n\n\n");
          userUnit = userUnit.split("_").join(" ");
          user.addActivity({
            actor: req.user.displayName,
            verb: "add",
            object: "picture:10",
            foreign_id: "picture:10",
            message: "I saved " + userSavings.toFixed(2) + " " + userUnit + " while handling waste!"
          });
        res.redirect("/");
      }
    }
  });

  app.post("/post-user-transportation-settings", function(req, res) {
    postgres.PostUserTransportationSettings(req.user.id, req.body, callback);
    function callback() {
      res.redirect("/");
    }
  });

  app.post("/post-user-transportation", function(req, res) {
    postgres.PostUserTransportation(req.user.id, req.body, callback);
    function callback(formResults) {
      var stream = require("getstream");
        // Instantiate a new client (server side)
        client = stream.connect(
          process.env.STREAM_ID,
          process.env.STREAM_SECRET,
          process.env.STREAM_APP
        );
        var userName = String(req.user.id);
        var user = client.feed("user", userName);
        // User follows everyone
        var userTimeline = client.feed("timeline", userName);
        postgres.GetUserBySocialId(req.user.id, callback);
        function callback(userResults){
          userResults = userResults.rows[0];
          var userSavings = formResults.saved * userResults.conversion_factor;
          var userUnit = userResults.conversion_unit;
          console.log(JSON.stringify(userResults) + "\n\n\n\n\n\n\n");
          userUnit = userUnit.split("_").join(" ");
          user.addActivity({
            actor: req.user.displayName,
            verb: "add",
            object: "picture:10",
            foreign_id: "picture:10",
            message: "I saved " + userSavings.toFixed(2) + " " + userUnit + " while using transportation!"
          });
        res.redirect("/");
      }
    }
  });

  function isLoggedIn(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect("/login");
    }
  }

  function isRegistered(req, res, next) {
    postgres.GetUserBySocialId(req.user.id, callback);
    function callback(result) {
      if (result.rows.length == 0) {
        postgres.PostUserBySocialId(req.user.id, callback2);
        function callback2() {
          next();
        }
      } else {
        next();
      }
    }
  }

  function isSettingsSet(req, res, next) {
    postgres.GetUserSettingsBySocialId(req.user.id, callback);
    function callback(result) {
      if (result == null) {
        res.redirect("/settings");
      } else {
        next();
      }
    }
  }

  function followAllUsers(req, res, next) {
    var stream = require("getstream");
    // Instantiate a new client (server side)
    client = stream.connect(
      process.env.STREAM_ID,
      process.env.STREAM_SECRET,
      process.env.STREAM_APP
    );
    var userName = String(req.user.id);
    var user = client.feed("user", userName);
    // User follows everyone
    var userTimeline = client.feed("timeline", userName);
    postgres.GetAllUserIds(callback);
    function callback(result) {
      for (var i = 0; i < result.rows.length; i++) {
        userTimeline.follow("user", result.rows[i].social_id);
      }

      // User gets their timeline
      userTimeline.get({ limit: 10 }).then(function(results) {
        var activityData = results;
        console.log(results);
        next(JSON.stringify(results.results));
        // Read the next page, using id filtering for optimal performance:
        userTimeline
          .get({ limit: 10, id_lte: activityData[activityData.length - 1].id })
          .then(function(results2) {
            var nextActivityData = results2;
          });
      });
    }
  }
};
