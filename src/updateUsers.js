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
  // Get all the summoners
  function (callback) {
    db.psqlQuery(sql.select(['user_id', 'summoner_id'], 'users'), callback);
  }, 

  function (users, callback) {
    
    // Loop through each summoner
    eachSeries(
      users.rows,

      function (item, callback) {
        setTimeout(function () {
          riotAPI.getSummonerBySummonerId(region, item.summoner_id, function(err, res) {

            res = res[item.summoner_id]; // Because { "000000": { name:'', summonerLevel:0 } } crap

            // Update summoner basic info
            db.psqlQuery(
              sql.update('users', {
                name : res.name,
                level : res.summonerLevel,
                profile_icon_id: res.profileIconId
              }, {
                user_id : item.user_id
              }), 

              function(err, res) {
                if (err) {
                  console.log(err);
                }
              }
            );

            // Update rank for anyone with level >= 30 otherwise finish the callback
            if(res.summonerLevel >= 30) {
              riotAPI.getLeagueBySummonerId(region, item.summoner_id, leagueVersion, function (err, res) {
                
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
              });
            } else {
              callback();
            }

          });
        }, 2000);
      }, 

      function (err, res) {
        if (err) {
          console.log(err);
        }

        callback();
      }
    );

  }
], 

function (err, res) {
  if (err) {
    console.log(err);
  }

  console.log('\nDone');
});
