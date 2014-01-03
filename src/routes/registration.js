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
				college_id = req.body.college_id;

		if(validator.validateRegistration(user, email, college_id)) {
			var confirmId = uuid.v1();
      psql.query(sql.insert('users', {
          'email'           : email,
          'college_id'      : college_id,
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
    app.psql.query(app.sql.update('users', {
        'confirmation_id' : ''
      }, {
        'name' : req.params.user,
        'confirmation_id' : req.params.confirmId
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
