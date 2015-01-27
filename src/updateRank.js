var configData      = require('./config').configData;
var eachSeries      = require('async').eachSeries;
var Irelia  = require('irelia');
var waterfall       = require('async').waterfall;
var pg              = require('pg');
var db              = new require('./helpers/db');
var sql             = require('./helpers/sql');
var getRank         = require('./helpers/rank').getRank;
var riotAPI         = new Irelia({
  key: configData.riotAPIKey,
  host: 'na.api.pvp.net',
  path: '/api/lol/',
  secure: true,
  debug: true
});

var QUEUE_TYPE = 'RANKED_SOLO_5X5'
var leagueVersion = 'v2.5';
var region = 'na';

waterfall([
  function (callback) {
    db.psqlQuery(sql.select(['user_id', 'summoner_id'], 'users'), callback);
  }, function (users, callback) {
    eachSeries(users.rows,
      function (item, callback) {
        setTimeout(function () {
          riotAPI.getLeagueBySummonerId(region, item.summoner_id, leagueVersion,
              function (err, res) {
              // handles undefined res as 'unkown' rank
              res = getRank(res, item.summoner_id);
              db.psqlQuery(sql.update('users', {
                  rank : res.rank,
                  tier : res.tier
                }, {
                  user_id : item.user_id
                }), function (err, res) {
                  if (err) {
                    console.log(err);
                  }

                  callback();
                }
              );
            }
          );
        }, 2000);
      }, function (err, res) {
        if (err) {
          console.log(err);
        }

        callback();
      }
    );
  }], function (err, res) {
    if (err) {
      console.log(err);
    }

    console.log('\nDone');
  }
);
