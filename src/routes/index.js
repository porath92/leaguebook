function routes(app) {
	var _ = require('underscore');
  app.get('/', function(req, res){
    app.psql.query(app.sql.select(['name', 'college_id'], 'college'), function (err, data) {
    	var registered = (req.query.r == 1) ? false : true;
      res.render('index',
      {
        title: 'LeagueBook',
        registered: registered,
        colleges: data.rows
      });
    });
  });

  require('./registration')(app);
}

module.exports = routes;
