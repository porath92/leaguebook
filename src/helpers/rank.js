module.exports.getRank = function (data, summonerId) {
  var res   = {};
  var _     = require('underscore');
  var ranks = {
    challenger: 6,
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

  res.rank = ranks[res.tier.toLowerCase()];

  return res;
}
