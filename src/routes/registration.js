module.exports = function(app) {
  var _         = require('underscore'),
      uuid      = require('node-uuid'),
      validator = require('../helpers/validator'),
      emailer   = require('../helpers/email'),
      express   = require('express'),
      router    = express.Router(),
      config    = require('../config').configData;

  router.post('/enroll', function(req, res) {
    var user          = req.body.summoner,
        email         = req.body.email,
        college_id    = req.body.college_id,
        registeredURL = config.baseURL;

    validator.validateRegistration(user, email, college_id, function(summoner, errors){
      if (errors.school) {
        res.redirect(registeredURL + '/?r=4');
        return;
      }

      if (errors.email) {
        res.redirect(registeredURL + '/?r=0');
        return;
      }

      if (errors.summoner) {
        res.redirect(registeredURL + '/?r=5');
        return;
      }

      if(!summoner){
        res.redirect(registeredURL + '/?r=0');
        return;
      }

      //Check if user already exists
      req.psql.psqlQuery(req.sql.getUserByName(user), function(err, result) {
        if(result.rows.length == 0) {
          var confirmId = uuid.v1();
          //Okay no user exists with this name, now insert them
          req.psql.psqlQuery(req.sql.insert('users', {
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
          res.redirect(registeredURL);
        }else {
          registeredURL = registeredURL + '/?r=3';
          res.redirect(registeredURL);
        }
      });
    });
  });

  router.get('/confirm/:user/:confirmId', function(req, res) {
    req.psql.psqlQquery(req.sql.update('users', {
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

  return router;
}
