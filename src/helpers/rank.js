module.exports.getRank = function (data) {
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

  if(_.isUndefined(data.tier)) {
    res.tier = 'UNRANKED';
  }else {
    res.tier = data.tier;
  }

  res.rank = ranks[res.tier.toLowerCase()];

  return res;
}
