module.exports = function(app) {
	var _ 				= require('underscore'),
			uuid 			= require('node-uuid'),
			validator = require('../helpers/validator'),
			emailer 	= require('../helpers/email'),
			config 		= require('../config').configData;

	app.post('/enroll', function(req, res) {
		var user   = req.body.summoner,
				email  = req.body.email,
				school = req.body.school;

		if(validator.validateRegistration(user, email, school)) {
			var confirmId = uuid.v1();
			//TODO: Save user in database
			var returnURL = config.baseURL = "/confirm/" + user + "/" + confirmId;
			emailer.sendConfirmation(email, returnURL);
		}

		var registeredURL = config.baseURL + '/?r=1';
		res.redirect(registeredURL);
	});

	app.get('/confirm/:user/:confirmId', function(req, res) {
		//pull user info and check for the confirm id
		//remove confirm id from user if it exists
	});
}
