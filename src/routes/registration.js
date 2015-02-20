module.exports = function(app) {
  var _         = require('underscore'),
      uuid      = require('node-uuid'),
      validator = require('../helpers/validator'),
      emailer   = require('../helpers/email'),
      express   = require('express'),
      router    = express.Router(),
      config    = require('../config').configData,
      db        = require('../helpers/db'),
      cache   = require('basic-cache'),
      sql       = require('../helpers/sql');

  router.post('/enroll', function(req, res) {
    var user          = req.body.summoner,
        email         = req.body.email,
        college_id    = req.body.college_id,
        slug          = req.body.college_slug,
        registeredURL = config.baseURL;

    validator.validateRegistration(user, email, college_id, function(summoner, errors){
      var cacheKey = "school:" + slug;

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
      db.psqlQuery(sql.getUserByName(user), function(err, result) {
        if(err) {
          res.status(500);
          res.render('500', {title:'500: Internal Server Error', error: (err || "DB ERROR")});
        }else if(result.rows.length == 0) {
          var confirmId = uuid.v1();
          //Okay no user exists with this name, now insert them
          db.psqlQuery(sql.insert('users', {
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
          cache.clear(cacheKey);
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
    db.psqlQquery(sql.update('users', {
        'confirmation_id' : ''
      }, {
        'name' : req.params.user,
        'confirmation_id' : req.params.confirmId
      }), function (err, result) {
        if (!err) {
          
          res.redirect(config.baseURL + '/?r=2');
        } else {
          res.status(500);
          res.render('500', {title:'500: Internal Server Error', error: (err || "DB ERROR")});
        }
      }
    );
  });

  return router;
}
