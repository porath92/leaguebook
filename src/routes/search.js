module.exports = function(app) {
  var _   = require('underscore'),
      express = require('express'),
      router  = express.Router(),
      db      = require('../helpers/db'),
      cache   = require('basic-cache');

  router.get('/search', function(req, res) {
    var cacheKey = 'search:' + req.query.keyword;
    var cachedSearch = cache.get(cacheKey);

    if(cachedSearch) {
      res.render('search',
      {
        keyword: req.query.keyword,
        schools: cachedSearch
      });
    }else {
      db.psqlQuery("select college.college_id, college.name, college.slug, COUNT(users.user_id) AS summoner_count, round(avg(users.rank)*count(users.rank)) as college_score from college inner join users on college.college_id = users.college_id where (LOWER(college.name) LIKE LOWER('%" + req.query.keyword + "%')) group by college.college_id, college.name, college.slug order by college.name",
        function (err, data) {
          if(err) {
            res.status(500);
            res.render('500', {title:'500: Internal Server Error', error: error});
          }else {
            // cache for 2 minutes
            cache.set(cacheKey, data.rows, 120000);
            res.render('search',
            {
              keyword: req.query.keyword,
              schools: data.rows
            });
          }
      });
    }
  });

  return router;
};
