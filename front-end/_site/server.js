var express = require('express');
var request = require('request');
var app = express();

function proxy() {
    app.use('/', function(req, res) {
        console.log(req.query);
        var sid = req.query.sid[1].trim();
        var flag = req.query.flag;
        var GetPlayerSummaries ="ISteamUser/GetPlayerSummaries/v0002/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamids=";
        var ResolveVanityUrl ="ISteamUser/ResolveVanityURL/v0001/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&vanityurl=";
        var RecentlyPlayedGames = "IPlayerService/GetRecentlyPlayedGames/v0001/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamid=";
        var GetOwnedGames = "IPlayerService/GetOwnedGames/v0001/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamid=";
        var url = "http://api.steampowered.com/"
        
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
        request(url + ResolveVanityUrl + sid, function(error, response, body) {
            var newid = JSON.parse(body).response.steamid
            if (newid !== undefined) {
                sid = newid;
            }
            if (flag === '1'){
                url += GetPlayerSummaries+sid;
            }else if (flag === '2'){
                url += GetOwnedGames+sid+"&include_played_free_games=1";
            }else if (flag === '3'){
                url += RecentlyPlayedGames+sid;
            }
            req.pipe(request(url)).pipe(res);
        });
    });
}

proxy();
app.listen(process.env.PORT || 3000);