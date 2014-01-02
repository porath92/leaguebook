exports.connect = function(callback) {
  var configData = require('../config').configData;
  var pg         = require('pg');
  var psql       = new pg.Client(configData.dbURL);

  psql.connect(function (err, res) {
    console.log(err);
    callback(psql);
  });
}
