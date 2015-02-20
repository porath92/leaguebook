var config = require('../config').configData;
var Irelia = require('irelia');
var api    = new Irelia({
  key: config.riotAPIKey,
  host: 'na.api.pvp.net',
  path: '/api/lol/',
  secure: true,
  debug: false
});
var db     = require('../helpers/db');
var sql    = require('../helpers/sql');
var cache   = require('basic-cache');

module.exports = {
  getRank: function (data, summonerId) {
    var res   = {};
    var _     = require('underscore');
    var ranks = {
      challenger: 7,
      master: 6,
      diamond: 5,
      platinum: 4,
      gold: 3,
      silver: 2,
      bronze: 1,
      unranked: 0
    };

    var QUEUE_TYPE = 'RANKED_SOLO_5x5';

    if(!data) {
      res.tier = 'UNRANKED';
    }else if(summonerId && data[summonerId.toString()]) {
      _.each(data[summonerId.toString()], function(rank) {
        if(rank.queue === QUEUE_TYPE && rank.tier) {
          res.tier = rank.tier;
        }
      }, this);
      if(_.isUndefined(res.tier)) { res.tier = 'UNRANKED'; }
    }else {
      res.tier = 'UNRANKED';
    }

    res.rank = ranks[res.tier.toLowerCase()] || 0;

    return res;
  },

  updateRank: function(summoner, schoolInfo) {
    var self = this;
    var expireDate = new Date(summoner['last_updated']);
    var now = new Date();

    // Set expire date for 7 days after the last updated date.
    expireDate.setDate(expireDate.getDate() + 7);

    if(now > expireDate) {
      api.getLeagueBySummonerId('na', summoner.summoner_id, 'v2.5',
        function(err, res) {
          // TODO: Make it so we don't reach API key request limit and err here. (Summoner Service is probably down.)
          if(!err) {
            console.log('ranked');
            var r = self.getRank(res, summoner.summoner_id);
            schoolInfo.college_score = self.getCollegeScoreWithNewRank(schoolInfo.college_score, summoner.rank, r.rank);
            summoner.rank = r.rank;
            summoner.tier = r.tier;

            db.psqlQuery(sql.updateUserRank(summoner, self.toISO(now)));
          }else {
            console.log('unranked');
            if(err.statusCode === 404) {
              // unranked, need to update last_updated time for user
              api.getSummonerBySummonerId('na', summoner.summonerId, function(err, res) {
                if(!err) {
                  summoner.level  = res.summonerLevel;
                  summoner.profile_icon_id = res.profileIconId;
                  db.psqlQuery(sql.updateUserRank(summoner, self.toISO(now)));
                } else {
                  console.log("ERR (UpdateRank-Unranked): ", "API Limit Reached OR Riot API is down.");
                }
              });
            }else {
              console.log("ERR (UpdateRank): ", "API Limit Reached OR Riot API is down.");
            }
          }
        }
      );
    }
  },

  getCollegeScoreWithNewRank: function(score, oldRank, newRank) {
    return score - oldRank + newRank;
  },

  toISO: function(date) {
    var self = this;
    return date.getUTCFullYear()
        + '-' + self.pad( date.getUTCMonth() + 1 )
        + '-' + self.pad( date.getUTCDate() );
  },

  pad: function(number) {
    var r = String(number);
    if ( r.length === 1 ) {
      r = '0' + r;
    }
    return r;
  }
};
