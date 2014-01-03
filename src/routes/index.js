function routes(app) {
  var _ = require('underscore');
  var config = require('../config.js').configData;
  app.get('/', function(req, res){

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
    console.log('r is ' + req.query.r);
    switch(req.query.r) {
      case '0':
        alertMsg = "Error processing email, see Doctor Mundo if problem persists.";
        alertType = "alert-danger";
        break;
      case '1':
        alertMsg = "Return to base Summoner to buy items and verify your email!";
        alertType = "alert-info";
        break;
      case '2':
        alertMsg = "Pentakill! Victory! You have sucessfully been added to the LeagueBook Database.";
        alertType = "alert-success";
        break;
    }
    console.log('alertType is ');
    console.log(alertType);
    res.render('index',
    {
      champion    : champion,
      baseUrl     : config.baseURL,
      alertType   : alertType,
      alertMsg    : alertMsg
    });
  });

  require('./ajax')(app);
  require('./registration')(app);
  require('./schools')(app);
}

module.exports = routes;
