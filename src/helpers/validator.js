var _ = require('underscore');
var RiotAPI = require('riot-api');
var api = new RiotAPI('47319b52-dccf-41f9-a4dd-1b594255f0e6');
module.exports = {
	validateEmail: function(email) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([Ee][Dd][Uu])|(madglory.com)|(madgloryint.com)|(riotgames.com)$/;
		return reg.test(email);
	},

	validateRegistration: function(user, email, school, callback) {
		var self = this;

		api.getSummoner({ summonerName: user }, function(response){
			
			if(_.isUndefined(response.id) || _.isEmpty(email) || _.isEmpty(school)) {
				return callback(false);
			}else if(!self.validateEmail(email)) {
				return callback(false);
			}else{
				//Get rank
				api.getLeagues({
					'region': 'NA',
					'queue'	: 'RANKED_SOLO_5x5',
					'summonerId'	: response.id 
				},
				function(data) {
					if(_.isUndefined(data.tier)) {
						response.tier = 'Unranked';
					}else {
						response.tier = data.tier;
					}
					switch(response.tier.toLowerCase()) {
						case 'challenger':
								response.rank = 6;
							break;
						case 'diamond':
								response.rank = 5;
							break;
						case 'platinum':
								response.rank = 4;
							break;
						case 'gold':
								response.rank = 3;
							break;
						case 'silver':
								response.rank = 2;
							break;
						case 'bronze':
								response.rank = 1;
							break;
						default:
							response.rank = 0;
					}
					return callback(response);
				});
			}
		});
	}
}