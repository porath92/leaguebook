var _ = require('underscore');
var RiotAPI = require('riot-api');
var api = new RiotAPI('47319b52-dccf-41f9-a4dd-1b594255f0e6');
module.exports = {
	validateEmail: function(email) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.[Ee][Dd][Uu]$/;
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
				return callback(response);
			}
		});
	}
}