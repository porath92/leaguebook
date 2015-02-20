var configData = require('../config').configData;
var pg         = require('pg');

pg.defaults.poolSize = 20;
pg.defaults.poolIdleTimeout = 30000;
pg.defaults.reapIntervalMillis = 1000;

module.exports = {
  psqlQuery: function(sql, callback) {
    console.log(sql);
    pg.connect(configData.dbURL, function(err, client, done) {
      var handleError = function(err) {
        if(!err) return false;
        done(client);
        console.log(err);
        if(callback) callback(err, null);
        return true;
      };

      client.query(sql, function(err, res) {
        if(handleError(err)) return;
        done();
        if(callback) callback(err, res);
      });
    });
  }
}