module.exports = function(app) {
  var _         = require('underscore'),
      express       = require('express'),
      router        = express.Router(),
      config        = require('../config.js').configData,
      collegeHelper = require('../helpers/colleges');
  
  router.get('/', function(req, res){
    var champions = [
      'Ahri','Akali','Alistar','Amumu','Anivia','Annie','Ashe','Blitzcrank','Brand',
      'Caitlyn','Cassiopeia','Chogath','Corki','Darius','Diana','DrMundo','Draven',
      'Elise','Evelynn','Ezreal','FiddleSticks','Fiora','Fizz','Galio','Gangplank',
      'Garen','Gragas','Graves','Hecarim','Heimerdinger','Irelia','Janna','JarvanIV',
      'Jax','Jayce','Karma','Karthus','Kassadin','Katarina','Kayle','Kennen','Khazix',
      'KogMaw','Leblanc','LeeSin','Leona','Lissandra','Lulu','Lux','Malphite','Malzahar',
      'Maokai','MasterYi','MissFortune','Mordekaiser','Morgana','Nami','Nasus','Nautilus',
      'Nidalee','Nocturne','Nunu','Olaf','Orianna','Pantheon','Poppy','Quinn','Rammus','Renekton',
      'Rengar','Riven','Rumble','Ryze','Sejuani','Shaco','Shen','Shyvana','Singed','Sion','Sivir',
      'Skarner','Sona','Soraka','Swain','Syndra','Talon','Taric','Teemo','Thresh','Tristana',
      'Trundle','Tryndamere','TwistedFate','Twitch','Udyr','Urgot','Varus','Vayne','Veigar','Vi',
      'Viktor','Vladimir','Volibear','Warwick','MonkeyKing','Xerath','XinZhao','Yorick','Zac',
      'Zed','Ziggs','Zilean','Zyra'
    ];
    var champion = champions[Math.floor(Math.random() * champions.length)];
    var alertMsg, alertType;
    switch(req.query.r) {
      case '0':
        alertMsg = "Error processing email, Mundo not detect .edu email.";
        alertType = "alert-danger";
        break;
      case '1':
        alertMsg = "Mundo says verify email.";
        alertType = "alert-info";
        break;
      case '2':
        alertMsg = "Pentakill! Victory! Mundo can find you now!";
        alertType = "alert-success";
        break;
      case '3':
        alertMsg = "Mundo says user already exists!";
        alertType = "alert-warning";
        break;
      case '4':
        alertMsg = "Mundo says school does not exist, Mundo uses autocomplete school names only.";
        alertType = "alert-warning";
        break;
      case '5':
        alertMsg = "Mundo could not find your summoner.";
        alertType = "alert-warning";
        break;
    }

    collegeHelper.getRandomColleges(function (err, colleges) {
      if(colleges) {
        res.render('index',
        {
          champion    : champion,
          baseUrl     : config.baseURL,
          alertType   : alertType,
          alertMsg    : alertMsg,
          colleges    : colleges
        });
      }else {
        res.status(500);
        res.render('500', {title:'500: Internal Server Error', error: (err || "DB ERROR")});
      }
    });
  });

  require('./ajax')(app);
  require('./registration')(app);
  require('./schools')(app);
  require('./search')(app);

  return router;
}