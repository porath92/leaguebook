var nodemailer = require('nodemailer');
var config		 = require('../config').configData;
module.exports = {
	sendConfirmation: function(email, returnURL) {
		var smtpTransport = nodemailer.createTransport("SMTP",{
	    service: "Gmail",
	    auth: {
        user: "leagueoflegendsbook@gmail.com",
        pass: config.mail
	    }
		});

		var mailOptions = {
	    from: "LeagueBook Confirmation <leagueoflegendsbook@gmail.com>",
	    to: email,
	    subject: "LeagueBook: Please confirm your email address.",
	    text: "Please confirm that this is indeed you!",
	    html: "Thank you for registering! Please confirm your summoner with <a href='" + returnURL + "'>this link.</a>"
		}

		smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	        console.log(error);
	    }else{
	        console.log("Message sent: " + response.message);
	    }
	    smtpTransport.close();
		});
	}
}