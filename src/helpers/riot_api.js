module.exports = function() {
	return function(req, res, next) {
		req.riotAPI = undefined;
		next();
	};
};