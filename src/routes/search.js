var _ = require('underscore');

module.exports = function(app) {
  app.get('/search', function(req, res) {
    req.psql.query("select college.college_id, college.name, college.slug, COUNT(users.user_id) AS summoner_count, round(avg(users.rank)*count(users.rank)) as college_score from college inner join users on college.college_id = users.college_id where (LOWER(college.name) LIKE LOWER('%" + req.query.keyword + "%')) group by college.college_id, college.name, college.slug order by college.name", function (err, data) {
      
      res.render('search',
      {
        keyword: req.query.keyword,
        schools: data.rows
      });
    });
  });
};
