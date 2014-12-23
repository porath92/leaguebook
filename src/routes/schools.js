module.exports = function(app) {
  var _       = require('underscore'),
      pg      = require('pg'),
      db      = require('../helpers/db'),
      sql     = require('../helpers/sql'),
      express = require('express'),
      router  = express.Router();

  router.get('/schools', function(req, res) {
    db.psqlQuery('select college.name, college.slug, COUNT(users.user_id) AS summoner_count, round(avg(users.rank)*count(users.rank)) as college_score from college inner join users on college.college_id = users.college_id group by college.name, college.slug order by college_score DESC, college.name',
      function (err, data) {
        if(err) {
          res.status(500);
          res.render('500', {title:'500: Internal Server Error', error: (err || "DB ERROR")});
        }else {
          res.render('schools-list',
          {
            schools: data.rows
          });
        }
    });
  });

  router.get('/schools/:school', function(req, res) {
    db.psqlQuery("select college.college_id, college.name, college.slug, COUNT(users.user_id) AS summoner_count, round(avg(users.rank)*count(users.rank)) as college_score from college inner join users on college.college_id = users.college_id where college.slug = '" + req.params.school + "' group by college.college_id, college.name, college.slug order by college_score DESC, college.name",
      function(err, data) {
        var school = data.rows[0];
        if(school && !_.isEmpty(school)) {
          db.psqlQuery(sql.getUsers(school.college_id), function(err, result) {
            var summoners = [];

            if (err) {
              console.log(err);
            } else {
              summoners = result.rows;
            }

            res.render('school',
            {
              school: school,
              summoners: summoners
            });
          });
        }else if(_.isEmpty(school)) {
          res.status(404);
          res.render('404', {title: '404: School Not Found'});
        }else {
          res.status(500);
          res.render('500', {title:'500: Internal Server Error', error: (err || "DB ERROR")});
        }
      }
    );
  });
  
  return router;
};