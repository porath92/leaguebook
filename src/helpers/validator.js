var _ = require('underscore');
var RiotAPI = require('riot-api');
var api = new RiotAPI(require('../config').configData.riotAPIKey);
var getRank = require('./rank').getRank;
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

		api.getSummoner({ summonerName: user }, function(response){
			if(_.isUndefined(response.id)) {
				return callback(false, {summoner: 'Invalid Summoner'});
			}

			//Get rank
			api.getLeagues(
				{
					'region': 'NA',
					'queue'	: 'RANKED_SOLO_5x5',
					'summonerId'	: response.id
				},
				function(data) {
          var rank = getRank(data);

					response.rank = rank.rank;
          response.tier = rank.tier;

					return callback(response, {});
				}
			);
		});
	}
}
