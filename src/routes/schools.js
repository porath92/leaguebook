module.exports = function(app) {
  var _       = require('underscore'),
      pg      = require('pg'),
      db      = require('../helpers/db'),
      sql     = require('../helpers/sql'),
      rHelper = require('../helpers/rank'),
      express = require('express'),
      cache   = require('basic-cache'),
      router  = express.Router();

  router.get('/schools', function(req, res) {
    var cacheKey = 'schools';
    var cachedSchools = cache.get(cacheKey);

    if(cachedSchools) {
      res.render('schools-list',
      {
        schools: cachedSchools
      });
    }else {
      db.psqlQuery('select college.name, college.slug, COUNT(users.user_id) AS summoner_count, round(avg(users.rank)*count(users.rank)) as college_score from college inner join users on college.college_id = users.college_id group by college.name, college.slug order by college_score DESC, college.name',
        function (err, data) {
          if(err) {
            res.status(500);
            res.render('500', {title:'500: Internal Server Error', error: (err || "DB ERROR")});
          }else {
            var schools = data.rows;

            // cache for 1 minute
            cache.set(cacheKey, schools, 60000)
            res.render('schools-list',
            {
              schools: schools
            });
          }
      });
    }
  });

  router.get('/schools/:school', function(req, res) {
    var schoolInfo = {};
    var cacheKey = "school:" + req.params.school;
    var cachedSchool = cache.get(cacheKey);

    if(cachedSchool) {
      res.render('school',
      {
        school: cachedSchool.school,
        summoners: cachedSchool.summoners
      });
    }else {
      db.psqlQuery("select college.college_id, college.name, college.slug, COUNT(users.user_id) AS summoner_count, round(avg(users.rank)*count(users.rank)) as college_score from college inner join users on college.college_id = users.college_id where college.slug = '" + req.params.school + "' group by college.college_id, college.name, college.slug order by college_score DESC, college.name",
        function(err, data) {
          schoolInfo.school = data.rows[0];
          if(schoolInfo.school && !_.isEmpty(schoolInfo.school)) {
            db.psqlQuery(sql.getUsers(schoolInfo.school.college_id), function(err, result) {
              if(err) {
                console.log(err);
                res.status(500);
                res.render('500', {title:'500: Internal Server Error', error: (err || "DB ERROR")});
              } else {
                schoolInfo.summoners = result.rows;

                //update any necessary ranks
                _.each(schoolInfo.summoners, function(summoner) {
                  rHelper.updateRank(summoner, schoolInfo);
                }, this);
                
                // cache for 5 minutes
                cache.set(cacheKey, schoolInfo, 300000);
                res.render('school',
                {
                  school: schoolInfo.school,
                  summoners: (schoolInfo.summoners || [])
                });
              }
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
    }
  });
  
  return router;
};