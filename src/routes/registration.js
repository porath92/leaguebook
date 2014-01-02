module.exports = function(app) {
	var _ 				= require('underscore'),
			uuid 			= require('node-uuid'),
			validator = require('../helpers/validator'),
			emailer 	= require('../helpers/email'),
			config 		= require('../config').configData;

	app.post('/enroll', function(req, res) {
    var psql = app.psql;
    var sql  = require('../sql');

		var user   = req.body.summoner,
				email  = req.body.email,
				school = req.body.school;

		if(validator.validateRegistration(user, email, school)) {
			var confirmId = uuid.v1();
      psql.query(sql.insert('users', {
          'email'           : email,
          'college_id'      : school,
          'name'            : user,
          'confirmation_id' : confirmId
        }), function (err, res) {
			    var returnURL = config.baseURL + "/confirm/" + user + "/" + confirmId;
			    emailer.sendConfirmation(email, returnURL);
        }
      );
		}
		var registeredURL = config.baseURL + '/?r=1';
		res.redirect(registeredURL);
	});

	app.get('/confirm/:user/:confirmId', function(req, res) {
    app.psql.query(app.sql('update', 'users', {
        'confirmation_id' : ''
      }, {
        'name' : user,
        'confirmation_id' : confirmId
      }), function (err) {
        if (!err) {
          res.redirect(config.baseURL);
        } else {
          console.log(err);
        }
      }
    );
	});
}
