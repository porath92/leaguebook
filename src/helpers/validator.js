var _ 							= require('underscore');
var RiotAPIWrapper 	= require('irelia');
var config 					= require('../config').configData;
var getRank 				= require('./rank').getRank;
var api 						= new RiotAPIWrapper({
  key: config.riotAPIKey,
  host: 'na.api.pvp.net',
  path: '/api/lol/',
  secure: true,
  debug: false
});
var leagueVersion 	= 'v2.5';
var region 					= 'na';

module.exports = {
	validateEmail: function(email) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([Ee][Dd][Uu])|(madglory.com)|(madgloryint.com)|(riotgames.com)$/;
		return reg.test(email);
	},

	validateRegistration: function(user, email, school, callback) {
		var self = this;

		// basic validations before API request
		if (!self.validateEmail(email)) {
			return callback(false, {email: 'Invalid Email'});
		}

		if (_.isEmpty(school)) {
			return callback(false, {school: 'Invalid School'});
		}

		api.getSummonerByName('na', encodeURIComponent(user), function(err, response){
			
			// lower-case and remove spaces
			var summonerKey = user.toLowerCase();
			summonerKey = summonerKey.replace(/\s+/g, '');

			if(response[summonerKey]) {
				var summoner = response[summonerKey];

				if(_.isUndefined(summoner.id)) {
					return callback(false, {summoner: 'Invalid Summoner'});
				}

				api.getLeagueBySummonerId(region, summoner.id, leagueVersion,
		      function (err, res) {
		      	var rank = getRank(res, summoner.id)
						summoner.rank = rank.rank;
	          summoner.tier = rank.tier;

						return callback(summoner, {});
					}
				);
			}else {
				return callback(null, {});
			}

		});
	}
}
