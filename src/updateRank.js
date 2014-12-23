var configData = require('./config').configData;
var eachSeries = require('async').eachSeries;
var RiotAPI    = require('riot-api');
var waterfall  = require('async').waterfall;
var api        = new RiotAPI(configData.riotAPIKey);
var pg         = require('pg');
var db         = new require('./helpers/db');
var sql        = require('./helpers/sql');
var getRank    = require('./helpers/rank').getRank;

waterfall([
  function (callback) {
    db.psqlQuery(sql.select(['user_id', 'summoner_id'], 'users'), callback);
  }, function (users, callback) {
    eachSeries(users.rows,
      function (item, callback) {
        setTimeout(function () {
          api.getLeagues({
              region     : 'NA',
              queue      : 'RANKED_SOLO_5x5',
              summonerId : item.summoner_id
            }, function (res) {
              res = getRank(res);
              db.psqlQuery(sql.update('users', {
                  rank : res.rank,
                  tier : res.tier
                }, {
                  user_id : item.user_id
                }), function (err, res) {
                  if (err) {
                    console.log(err);
                  }

                  console.log(res);

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
