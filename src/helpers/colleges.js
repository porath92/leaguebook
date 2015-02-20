var db = require('./db');
var sql = require('./sql');

module.exports = {
  getTop3: function(callback) {
    db.psqlQuery('select college.name, college.slug, COUNT(users.user_id) AS summoner_count, round(avg(users.rank)*count(users.rank)) as college_score from college inner join users on college.college_id = users.college_id group by college.name, college.slug order by college_score DESC, college.name LIMIT 3', function(err, res) {
      callback(err, res);
    });
  },

  getRandomColleges: function (callback) {
    var self = this;
    var collegeLimit = 6;
    var userLimit    = 3;

    db.psqlQuery(sql.getColleges(), function (err, res) {
      if(err) { callback(err, null); }

      if (res && res.rowCount > 0) {
        var colleges     = res.rows;
        var results      = [];
        var collegeIds   = [];
        var collegeUsers = {};

        collegeLimit = collegeLimit <= res.rows.length ? collegeLimit : colleges.length

        for (var x = 0; x < collegeLimit; x++) {
          var index = self.getRandom(0, colleges.length);

          collegeUsers[colleges[index].college_id] = [];

          results.push(colleges[index]);
          collegeIds.push(colleges[index].college_id);
          colleges.splice(index, 1);
        }

        db.psqlQuery(sql.getUsersFromColleges(collegeIds, userLimit), function (err, res) {
          if(err) { callback(err, null); }

          if (res && res.rowCount > 0) {
            var users = res.rows;

            for (var x = 0; x < users.length; x++) {
              collegeUsers[users[x].college_id].push(users[x]);
            }

            for (var x = 0; x < results.length; x++) {
              results[x].users = collegeUsers[results[x].college_id];
            }
          }

          callback(err, results);
        });
      }else {
        callback(err, null);
      }
    });
  },

  getRandom: function(min, max) {
    return Math.floor((Math.random()*max)+min);
  }
}
