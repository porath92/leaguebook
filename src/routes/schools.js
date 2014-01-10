var _ = require('underscore');

module.exports = function(app) {
  app.get('/schools', function(req, res) {
    app.psql.query('select college.name, college.slug, COUNT(users.user_id) AS summoner_count, round(avg(users.rank)*count(users.rank)) as college_score from college inner join users on college.college_id = users.college_id group by college.name, college.slug order by college_score DESC, college.name', function (err, data) {
      res.render('schools-list',
      {
        schools: data.rows
      });
    });
  });

  app.get('/schools/:school', function(req, res) {
    app.psql.query("select college.college_id, college.name, college.slug, COUNT(users.user_id) AS summoner_count, round(avg(users.rank)*count(users.rank)) as college_score from college inner join users on college.college_id = users.college_id where college.slug = '" + req.params.school + "' group by college.college_id, college.name, college.slug order by college_score DESC, college.name", function(err, data) {
      var school = data.rows[0];
      if(!_.isEmpty(school)) {
        app.psql.query(app.sql.getUsers(school.college_id), function(err, result) {
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
      }
    });
  });
};
