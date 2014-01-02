function routes(app) {
	var _ = require('underscore');
  app.get('/', function(req, res){
  	var registered = (req.query.r == 1) ? false : true;
    res.render('index',
    {
      title: 'LeagueBook',
      registered: registered
    });
  });

  require('./registration')(app);
}

module.exports = routes;
