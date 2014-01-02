module.exports = function(app) {
	var _ = require('underscore');
  var waterfall = require('async').waterfall;
  var sql       = require('../sql');

	app.get('/', function(req, res) {
    res.send(200);
	});
};
