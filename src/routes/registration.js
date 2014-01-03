module.exports = function(app) {
	var _ 				= require('underscore'),
			uuid 			= require('node-uuid'),
			validator = require('../helpers/validator'),
			emailer 	= require('../helpers/email'),
			config 		= require('../config').configData;

	app.post('/enroll', function(req, res) {
		var user          = req.body.summoner,
				email         = req.body.email,
				college_id    = req.body.college_id,
        registeredURL = config.baseURL,
        sql           = require('../sql'),
        psql          = app.psql;

    validator.validateRegistration(user, email, college_id, function(summoner){
      if(summoner){
        var confirmId = uuid.v1();
        psql.query(sql.insert('users', {
            'email'           : email,
            'college_id'      : college_id,
            'name'            : user,
            'summoner_id'     : summoner.id,
            'confirmation_id' : confirmId,
            'tier'            : summoner.tier,
            'rank'            : summoner.rank,
            'profile_icon_id' : summoner.profileIconId
          }), function (err, res) {
            var returnURL = config.baseURL + "/confirm/" + user + "/" + confirmId;
            emailer.sendConfirmation(email, returnURL);
          }
        );
        registeredURL = registeredURL + '/?r=1';
      }else{
        registeredURL = registeredURL + '/?r=0';  
      }
      res.redirect(registeredURL);
    });
		
	});

	app.get('/confirm/:user/:confirmId', function(req, res) {
    app.psql.query(app.sql.update('users', {
        'confirmation_id' : ''
      }, {
        'name' : req.params.user,
        'confirmation_id' : req.params.confirmId
      }), function (err) {
        if (!err) {
          res.redirect(config.baseURL + '/?r=2');
        } else {
          console.log(err);
        }
      }
    );
	});
}
