var pg         = require('pg');
var configData = require('./config').configData;
var psql       = new pg.Client(configData.dbURL);
var csv        = require('csv');
var csvPath    = __dirname + '/CSV_122014-600.csv';
var waterfall  = require('async').waterfall;
var sql        = require('./sql');

waterfall([
  function (callback) {
    psql.connect(function (err) {
      callback(err);
    });
  }, function (callback) {
    csv()
      .from.path(csvPath)
      .to.array(function (data) {
        var map  = {'name' : 1, 'unitid' : 0, 'state' : 4};
        var rows = [];

        for (var x = 1; x < data.length; x++) {
          var row = {};

          for (var col in map) {
            row[col] = data[x][map[col]];
          }

          rows.push(row);

          var query = sql.insert('college', row);
          psql.query(query, function (err) {
            if (err) {
            console.log('\n\n', query, err, row);
            }
          });
        }
        callback(null, rows);
      })
    ;
  }, function (rows, callback) {
    /*psql.query(sql.insertMulti('college', rows), function (err, res) {
      callback(err);
    });*/
    callback();
  }
], function (err, res) {
  console.log(err);
});

