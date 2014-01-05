var _ = require('underscore');

module.exports = function(app) {
  app.get('/schools', function(req, res) {
    app.psql.query('SELECT DISTINCT college.name, college.slug, COUNT(users.user_id) AS summoner_count FROM college INNER JOIN users ON college.college_id = users.college_id GROUP BY college.name, college.slug ORDER BY college.name', function (err, data) {
      res.render('schools-list',
      {
        schools: data.rows
      });
    });
  });

  app.get('/schools/:school', function(req, res) {
    app.psql.query(app.sql.select(
      ['name', 'college_id', 'size', 'state'],
      'college',
      { 
        slug: req.params.school
      }
    ), function(err, data) {
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
