var nodemailer = require('nodemailer');
module.exports = {
	sendConfirmation: function(email, returnURL) {
		var smtpTransport = nodemailer.createTransport("SMTP",{
	    service: "Gmail",
	    auth: {
        user: "leagueoflegendsbook@gmail.com",
        pass: "MagicKittens"
	    }
		});

		var mailOptions = {
	    from: "LeagueBook Confirmation <leagueoflegendsbook@gmail.com>",
	    to: email,
	    subject: "LeagueBook: Please confirm your email address.",
	    text: "Please confirm that this is indeed you!",
	    html: "Please confirm that this is indeed you! <a href='" + returnURL + "'>THIS LINK</a>"
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