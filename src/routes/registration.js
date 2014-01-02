module.exports = function(app) {
	var _ 					= require('underscore'),
			nodemailer 	= require('nodemailer'),
			uuid 				= require('node-uuid'),
			validator 	= require('../helpers/validator'),
			emailer 		= require('../helpers/email');

	app.post('/enroll', function(req, res) {
		var user   = req.body.summoner,
				email  = req.body.email,
				school = req.body.school;
				
		if(validator.validateRegistration(user, email, school)) {
			res.send(404);
		}else {
			var confirmId = uuid.v1();
			//TODO: Save user in database
			var returnURL = "leaguebook.herokuapp.com/confirm/" + user + "/" + confirmId;
			emailer.sendConfirmation(email, returnURL);
		}
		res.redirect('leaguebook.herokuapp.com/?r=1');
	});

	app.get('/confirm/:user/:confirmId', function(req, res) {
		//pull user info and check for the confirm id
		//remove confirm id from user if it exists
	});
}
