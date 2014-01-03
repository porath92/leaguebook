var _ = require('underscore');

module.exports = function(app) {
  app.get('/schools', function(req, res) {
    app.psql.query(app.sql.select(['name', 'college_id'], 'college', "LOWER(name) LIKE LOWER('%" + req.query.search + "%')"), function (err, data) {
      if(data.rows.length == 1) {
        res.redirect('/school/' + data.rows[0].college_id);
      }else {
        res.render('schools-list',
        {
          schools: data.rows
        });
      }
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
        //get members
        app.psql.query(app.sql.getUsers(school.college_id), function(err, data) {
          res.render('school',
          {
            school: school,
            summoners: data.rows
          });
        });
      }
    });
  });
};
