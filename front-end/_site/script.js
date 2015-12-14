$(function() {
    $('#all').hide();
    serverHost = "http://localhost:3000//";
    loadUserPreviews();
});

$("#idform").submit(function(e) {
    e.preventDefault();
    submit();
});

var playerPreviewList = ["76561198025207102", "76561197967853593", "76561198023545004", "76561198028934613", "76561197984820423", "76561198056146892"];

function submit() { 
    $('#all').show();
    $('#intro').hide();
    $(document).ready(function() {
        document.getElementById("main").innerHTML = ""; 
        document.getElementById("userInfo").innerHTML = "";
        document.getElementById("profilePicture").innerHTML = "";
        document.getElementById("profileInfo").innerHTML = "";
        document.getElementById("gameStats").innerHTML = "";
        document.getElementById("recentGames").innerHTML = "";

        document.getElementById("loader").innerHTML = '<div class="alert alert-info"' + 'role="alert"><strong>Loading User Info</strong> Please wait momentarily</div>';

        sid = document.getElementById("idform").elements[0].value;
        console.log(sid);

        $.getJSON(serverHost + "?sid=", {
            sid: sid,
            flag: 1
        }, function(result) {
            document.getElementById("main").innerHTML = "";
            console.log(result);
            var user = result.response.players[0]; 
            if (user !== undefined) {
                var vState = user.communityvisibilitystate;

                loadProfilePicture(user);
                loadUserInfo(user);
                loadProfileInfo(user, vState);
                loadGameplayStats(user, vState);
                loadRecentGames(user);

                document.getElementById("loader").innerHTML = "";
            } else {
                document.getElementById("loader").innerHTML = '<div class="alert alert-danger" role="alert">' + '<strong>User Could Not Be Found</strong> Please input an existing steam user id</div>';
            }
        }).fail(function(result) {
            document.getElementById("loader").innerHTML = '<div class="alert alert-danger" role="alert">' + '<strong>Could Not Contact Server</strong> Please try again later =/</div>';
        });


    });
}

function loadUserPreviews() {
    var sidUrl = "";
    for (var i = 0; i < playerPreviewList.length; i++) {
        sidUrl += playerPreviewList[i];
        if (i < playerPreviewList.length - 1) {
            sidUrl += ",";
        }
    }
    $.getJSON(serverHost + "?sid=", {
        sid: sidUrl,
        flag: 1
    }, function(result) {
        console.log(result);
        for (var i = 0; i < result.response.players.length; i++) {
            var picture = result.response.players[i].avatarfull;
            picture = newImage("" + picture);
            picture.sid = result.response.players[i].steamid;
            document.getElementById("previewUsers").appendChild(picture);
        }

        $("#previewUsers").children().dragAndDrop($("#intro"), $("#profilePicture"), function(event) {
            document.getElementById("idform").elements[0].value = event[0].sid;
            submit();
        });
    }).fail(function(result){
        $('#intro').hide();
        $('#all').show();
        document.getElementById("loader").innerHTML = '<div class="alert alert-danger" role="alert">' + '<strong>Could Not Contact Server</strong> Please try again later =/</div>';
    });
}

function newImage(src) {
    var img = document.createElement("img");
    img.src = src;
    return img;
}

function processTime(timeStamp) {
    var date = new Date(timeStamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = date.getFullYear();
    var month = months[date.getMonth()];
    var hours = date.getHours();
    var night = "AM";
    if (hours >= 12) { 
        night = "PM";
        if (hours !== 12) {
            hours = hours - 12;
        } 
    }
    if (hours === 0) {
        hours = 12;
    } 
    var day = "0" + date.getDate();
    var minutes = "0" + date.getMinutes();
    return (month + ' ' + day.substr(-2) + ' ' + year + ' at ' + hours + ':' + minutes.substr(-2) + ' ' + night);
}

function processPlaytime(minutes) { 
    if (minutes < 60) { 
        var unit = " minute";
        if (minutes > 1) {
            unit += "s";
        } 
        return minutes + unit;
    }
    var hours = minutes / 60; 
    hours = Math.round(hours * 10) / 10;
    if (hours < 24) {
        var unit = " hour";
        if (hours > 1) {
            unit += "s";
        } 
        return hours + unit;
    }
    var days = hours / 24; 
    days = Math.round(days * 10) / 10;
    if (days < 365) {
        var unit = " day";
        if (days > 1) {
            unit += "s";
        } 
        return days + unit + " or " + hours + " hours";
    }
    var years = days / 365; 
    years = Math.round(years * 10) / 10;
    var unit = " year";
    if (years > 1) {
        unit += "s";
    } 
    return years + unit + " or " + days + " days or " + hours + " hours";

}

function place(output, element) {
    if (element === undefined) {
        element = "main";
    } 
    document.getElementById(element).appendChild(document.createTextNode(output));
    document.getElementById(element).appendChild(document.createElement("br"));
}

function loadProfilePicture(user) {
    var picture = newImage("" + user.avatarfull);
    picture.id = "profilePic";
    document.getElementById("profilePicture").appendChild(picture);
}

function loadOnlineState(user) {
    var pState = user.personastate;
    var output = "User is: ";
    var state = "info";
    if (pState === 0) {
        output += "Offline";
        state = "danger";
    } else if (pState === 1) {
        output += "Online";
        state = "success";
    } else if (pState === 2) {
        output += "Busy";
    }
    else if (pState === 3) {
        output += "Away";
    } 
    else if (pState === 4) {
        output += "Snooze";
    } 
    else if (pState === 5) {
        output += "Looking to trade";
    } 
    else if (pState === 5) {
        output += "Looking to play";
    } 
    document.getElementById("userInfo").innerHTML += "<h3><span class='label label-" + state + "'>" + output + "</span><br></h3>"

    if (pState === 0) {
        place("Last online: " + processTime(user.lastlogoff), "userInfo");
    } else {
        if (user.gameextrainfo) { 
            place("Currently playing : " + user.gameextrainfo, "userInfo"); 
        } else {
            place("Not currently in game", "userInfo");
        }
    }
}

function loadRealNameandLocation(user) {
    if (user.realname) {
        place("Real name : " + user.realname, "userInfo");
    } 
    var country = user.loccountrycode;
    var state = user.locstatecode;
    var city = user.loccityid;


    $.getJSON("https://raw.githubusercontent.com/Holek/steam-friends-countries/master/data/steam_countries.json", function(result) {
        if (country) {
            country = result[country];
            state = country.states[state];
            city = state.cities[city];
            if (state) {
                state = state.name + ","
            } else {
                state = "";
            } 
            if (city) {
                city = city.name + ","
            } else {
                city = "";
            }
            place("Lives in : " + city + " " + state + " " + country.name, "userInfo");
        }
        if (user.steamid === "76561198023545004") {
            document.getElementById("userInfo").innerHTML += "<mark>★ ☆ Creator of this webapp!☆ ★ </mark>";
        }
    });
}

function loadUserInfo(user) {
    var name = document.createElement("h3") 
    name.appendChild(document.createTextNode(user.personaname));
    document.getElementById("userInfo").appendChild(name);
    loadOnlineState(user);
    loadRealNameandLocation(user);
}

function loadProfileInfo(user, vState) {
    place('');
    place("Steam id: " + user.steamid, "profileInfo");
    if (user.timecreated) {
        place("Profile created on: " + processTime(user.timecreated), "profileInfo");
    }
    var output = "Profile access : ";
    if (vState === 1) {
        output += "Private";
    } else if (vState === 2) {
        output += "Friends only";
    } else if (vState === 3) {
        output += "Friends of friends";
    } else if (vState === 4) {
        output += "Users only";
    } else if (vState === 5) {
        output += "Public";
    }
    place(output, "profileInfo");
    var profileLink = "Steam Community Profile Page".link("http://steamcommunity.com/profiles/" + user.steamid);
    document.getElementById("profileInfo").innerHTML += profileLink;
    place('', "profileInfo")
    place('', "profileInfo")
}

function loadGameplayStats(user, vState) {

    if (vState !== 1) {
        $.getJSON(serverHost + "?sid=", {
            sid: sid,
            flag: 2
        }, function(result) {
            console.log(result);
            var userGames = result.response;

            if (userGames.game_count) {
                place("Games owned : " + userGames.game_count, "gameStats");
                var totalPlaytime = 0;
                var playedGames = 0;
                for (i in userGames.games) {
                    var playtime = userGames.games[i].playtime_forever;
                    totalPlaytime += playtime;
                    if (playtime > 10) {
                        playedGames += 1;
                    }
                }
                var totalPlayedPercent = (playedGames / userGames.game_count) * 100;
                totalPlayedPercent = Math.round(totalPlayedPercent * 10) / 10;
                var averagePlaytime = totalPlaytime / playedGames;
                averagePlaytime = Math.round(averagePlaytime * 10) / 10;
                place("Total time in-game : " + processPlaytime(totalPlaytime), "gameStats");
                place("Played : " + totalPlayedPercent + "% of owned games (" + playedGames + '/' + userGames.game_count + ')', "gameStats");
                place("Average playtime per game : " + processPlaytime(averagePlaytime), "gameStats");
                place('', "gameStats");
            } else {
                place("User owns no games", "gameStats");
                place('', "gameStats");
                place('', "gameStats");
                place('', "gameStats");
                place('', "gameStats");
            }
        });
    } else {
        place('No public game statistics', "gameStats");
        place('', "gameStats");
        place('', "gameStats");
        place('', "gameStats");
    }
}

function loadRecentGames(user) {
    $.getJSON(serverHost + "?sid=", {
        sid: sid,
        flag: 3
    }, function(result) {
        console.log(result);
        if (result.response.games) {
            var games = result.response.games;
            for (var i = 0; i < games.length; i++) {
                if (games[i].name === undefined) {
                    continue;
                }
                var src = "http://media.steampowered.com/steamcommunity/public/images/apps/" + games[i].appid + "/" + games[i].img_logo_url + ".jpg";
                var name = document.createElement("h4")
                name.appendChild(document.createTextNode(games[i].name));
                document.getElementById("recentGames").appendChild(name)
                document.getElementById("recentGames").appendChild(newImage(src));
                place("", "recentGames");
                place("Last two weeks played : " + processPlaytime(games[i].playtime_2weeks), "recentGames");
                place("Total playtime : " + processPlaytime(games[i].playtime_forever), "recentGames");
                place('', "recentGames");
            }
        } else {
            place("No recently played games", "recentGames")
        }

    });
}