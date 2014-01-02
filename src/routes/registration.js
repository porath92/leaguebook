module.exports = function(app) {
	var _ = require('underscore');
	var nodemailer = require('nodemailer');
	var uuid = require('node-uuid');

	app.post('/register', function(req, res) {
		var user = req.body.summoner,
				userEmail = req.body.email,
				school = req.body.school;

		//TODO: Authorize valid .edu email and user
		var confirmId = uuid.v1();
		//TODO: Save user in database

		var returnURL = 'leaguebook.herokuapp.com/confirm/' + confirmId;
		var smtpTransport = nodemailer.createTransport("SMTP",{
	    service: "Gmail",
	    auth: {
        user: "leagueoflegendsbook@gmail.com",
        pass: "MagicKittens"
	    }
		});

		var mailOptions = {
	    from: "LeagueBook Confirmation <no-reply@leaguebook.herokuapp.com>", // sender address
	    to: userEmail, // list of receivers
	    subject: "LeagueBook: Please confirm your email address.", // Subject line
	    text: "Please confirm that this is indeed your email by clicking,", // plaintext body
	    html: "<a href='leaguebook.herokuapp.com/confirm/" + user + "/" + confirmId + "'>THIS LINK</a>" // html body
		}

		smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	        console.log(error);
	    }else{
	        console.log("Message sent: " + response.message);
	    }
	    smtpTransport.close(); // shut down the connection pool, no more messages
		});
	});

	app.get('/confirm/:user/:confirmId', function(req, res) {
		//pull user info and check for the confirm id
		//remove confirm id from user if it exists
	});
}