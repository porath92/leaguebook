var _ = require('underscore');
module.exports = {
	validateEmail: function(email) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.[Ee][Dd][Uu]$/;
		return reg.test(email);
	},

	validateRegistration: function(user, email, school) {
		if(_.isEmpty(user) || _.isEmpty(email) || _.isEmpty(school)) {
			return false;
		}else if(!this.validateEmail(email)) {
			return false;
		}
		return true;
	}
}