var express = require('express');
var request = require('request');
var app = express();

function proxy() {
    app.use('/', function(req, res) {
        var sid = req.query.sid[1].trim();
        var flag = sid.slice(-1);
        sid = sid.slice(0, sid.length-1);
        var url1 ="http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamids=";
        var url2 ="http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&vanityurl=";
        var url3 = "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamid=";
        var url = ""
        
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
        request(url2 + sid, function(error, response, body) {
            var newid = JSON.parse(body).response.steamid
            if (newid !== undefined) {
                sid = newid;
            }
            if (flag==1){url = url1+sid;}else{url = url3+sid;}
            req.pipe(request(url)).pipe(res);
        });
    });
}
proxy();
app.listen(process.env.PORT || 3000);