var express = require('express');
var request = require('request');
var app = express();

function proxy() {
    app.use('/', function(req, res) {
        var sid = req.query.sid[1].trim();
        var url =
            "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamids=";
        var url2 =
            "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&vanityurl=";
        //var url3 =  "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=FADC45FD3C92FDFFDBCDA01F2A4149A9&steamid=" + sid + "&format=json";
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept");
        request(url2 + sid, function(error, response, body) {
            var newid = JSON.parse(body).response.steamid
            if (newid !== undefined) {
                sid = newid;
            }
            //request(url+sid, function(err, resp, result){
            req.pipe(request(url + sid)).pipe(res);
            //})
        });
    });
}
proxy();
app.listen(process.env.PORT || 3000);