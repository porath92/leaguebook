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
  var limit = 3;

  app.psql.query(app.sql.getColleges(), function (err, res) {
    console.log(res);
    if (res && res.rowCount > 0) {
      var colleges = res.rows;
      var indices  = [];
      var results  = [];

      while(results.length < limit || colleges.length === 0) {
        var index = getRandom(0, colleges.length);
        console.log(colleges, index);

        results.push(colleges[index]);
        colleges.splice(index, 1);
      }

      callback(results);
    } else {
      if (err) {
        console.log(err);
      }

      callback([]);
    }
  });
}
