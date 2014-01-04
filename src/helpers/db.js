function getRandom(min, max) {
  return Math.floor((Math.random()*max)+min);
}

exports.connect = function(callback) {
  var configData = require('../config').configData;
  var pg         = require('pg');
  var psql       = new pg.Client(configData.dbURL);

  psql.connect(function (err, res) {
    if (err) {
      console.log(err);
    }

    callback(psql);
  });
}

exports.getRandomColleges = function (app, callback) {
  var collegeLimit = 6;
  var userLimit    = 3;

  app.psql.query(app.sql.getColleges(), function (err, res) {
    if (res && res.rowCount > 0) {
      var colleges     = res.rows;
      var results      = [];
      var collegeIds   = [];
      var collegeUsers = {};

      collegeLimit = collegeLimit <= res.rows.length ? collegeLimit : colleges.length

      for (var x = 0; x < collegeLimit; x++) {
        var index = getRandom(0, colleges.length);

        collegeUsers[colleges[index].college_id] = [];

        results.push(colleges[index]);
        collegeIds.push(colleges[index].college_id);
        colleges.splice(index, 1);
      }

      app.psql.query(app.sql.getUsersFromColleges(collegeIds, userLimit), function (err, res) {
        if (!err) {
          if (res && res.rowCount > 0) {
            var users = res.rows;

            for (var x = 0; x < users.length; x++) {
              collegeUsers[users[x].college_id].push(users[x]);
            }

            for (var x = 0; x < results.length; x++) {
              results[x].users = collegeUsers[results[x].college_id];
            }
          }
        } else {
          console.log(err);
        }

        callback(results);
      });
    } else {
      if (err) {
        console.log(err);
      }

      callback([]);
    }
  });
}
