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

  app.get('/school/:id', function(req, res) {
    var summoners = [
      {
        rank: 1,
        summoner: 'Shockem'
      },
      {
        rank: 2,
        summoner: 'ClayBot9000'
      }
    ];

    app.psql.query(app.sql.select(
      ['name', 'college_id', 'size', 'state'],
      'college',
      { 
        college_id: req.params.id
      }
    ), function(err, data) {
      var school = data.rows[0];
      if(!_.isEmpty(school)) {
        //get members
        res.render('school',
        {
          school: data.rows[0],
          summoners: summoners
        });
      }
    });
  });
};
