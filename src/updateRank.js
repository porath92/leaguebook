var configData = require('./config').configData;
var eachSeries = require('async').eachSeries;
var RiotAPI    = require('riot-api');
var waterfall  = require('async').waterfall;
var api        = new RiotAPI(configData.riotAPIKey);
var pg         = require('pg');
var psql       = new pg.Client(configData.dbURL);
var sql        = require('./sql');
var getRank    = require('./helpers/rank').getRank;

psql.connect();

waterfall([
  function (callback) {
    psql.query(sql.select(['user_id', 'name'], 'users'), callback);
  }], function (err, res) {
    eachSeries(res.rows,
      function (item, callback) {
        setTimeout(function () {
          api.getLeagues({
              region     : 'NA',
              queue      : 'RANKED_SOLO_5x5',
              summonerId : item.summoner_id
            }, function (res) {
              res = getRank(res);
              psql.query(sql.update('users', {
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
      }
    );
  }
);
