var pg         = require('pg');
var configData = require('./config').configData;
var psql       = new pg.Client(configData.dbURL);
var csv        = require('csv');
var csvPath    = __dirname + '/CSV_122014-600.csv';
var waterfall  = require('async').waterfall;
var eachSeries = require('async').eachSeries;
var sql        = require('./helpers/sql');

waterfall([
  function (callback) {
    psql.connect(function (err) {
      callback(err);
    });
  }, function (callback) {
    csv()
      .from.path(csvPath)
      .to.array(function (data) {
        callback(null, data);
      })
    ;
  }, function (data, callback) {
    var map  = {'name' : 1, 'unitid' : 0, 'state' : 4, 'slug' : 0};
    var rows = [];

    eachSeries(data, function (item, callback) {
      var row = {};

      for (var col in map) {
        if(col == 'slug'){
          row[col] = item[map['name']].toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
        } else {
          row[col] = item[map[col]];
        }
      }

      psql.query(sql.insert('college', row), function (err, res) {
        callback();
      });
    }, function (err, res) {
      if (err) {
        console.log(err);
      }

      callback(err);
    });
  }
], function (err, res) {
  console.log(err);
  psql.end();
});

