
    function newImage(src) {
        var img = document.createElement("img");
        img.src = src;
        img.hspace=0;
        img.vspace=15;
        return img;
    }

    function processTime(timeStamp){
        var date = new Date(timeStamp*1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = date.getFullYear();
        var month = months[date.getMonth()];
        var hours = date.getHours();
        var night = "AM";
        if(hours >= 12){
            night = "PM";
            if(hours!==12){hours = hours - 12;}    
        }
        if(hours==0){hours = 12;}
        var day = "0" + date.getDate();
        var minutes = "0" + date.getMinutes();
        return(month + ' ' + day.substr(-2) + ' ' +year + ' at ' + hours + ':' + minutes.substr(-2) + ' ' + night);
    }

    function place(output){
        
        document.getElementById("main").appendChild(document.createTextNode(output));
        document.getElementById("main").appendChild(document.createElement("br"));
    }
            
    function submit(){
        $(document).ready(function(){
            document.getElementById("main").innerHTML = "";
            place('');
            place("[Loading profile information]");
            var sid = document.getElementById("idform").elements[0].value;
            $.getJSON("http://localhost:3000//?sid=", {sid:sid, flag:1}, function(result){
                document.getElementById("main").innerHTML = "";
                console.log(result);
                var user = result.response.players[0];
                
                document.getElementById("main").appendChild(newImage(""+user.avatarfull));
                var name = document.createElement("h2")
                name.appendChild(document.createTextNode(user.personaname));
                document.getElementById("main").appendChild(name);
                
                var pState = user.personastate;
                output = "User is: ";
                if(pState == 0){output += "Offline"; }
                else if(pState == 1){output += "Online";}
                else if(pState == 2){output += "Busy";}
                else if(pState == 3){output += "Away"; }
                else if(pState == 4){output += "Snooze"; }
                else if(pState == 5){output += "Looking to trade"; }
                else if(pState == 5){output += "Looking to play"; }
                place(output);
                
                if(pState == 0){place("Last online : " + processTime(user.lastlogoff));}
                
                if(user.gameextrainfo){
                    place("Currently playing : " + user.gameextrainfo);
                }else{
                    place("Not currently in game");
                }
                
                
                place('');
                
                place("Steam id: " + user.steamid);
                
                if(user.timecreated){place("Profile created on : " + processTime(user.timecreated));}
                
                var vState = user.communityvisibilitystate;
                var output = "Profile access : ";
                if(vState == 1){output += "Private";}
                else if(vState == 2){output += "Friends only";}
                else if(vState == 3){output += "Friends of friends";}
                else if(vState == 4){output += "Users only"; }
                else if(vState == 5){output += "Public"; }
                place(output);              
                
                place('');
                
                if(user.realname){place("Real name : " + user.realname);}
                
                var country = user.loccountrycode;
                var state = user.locstatecode;
                var city = user.loccityid;
                

                $.getJSON("https://raw.githubusercontent.com/Holek/steam-friends-countries/master/data/steam_countries.json", function(result){
                    if(country){
                        document.getElementById("main").appendChild(document.createTextNode("[Loading location information]"));
                        country = result[country];
                        state = country.states[state];
                        city = state.cities[city];
                        if(state){state = state.name + ","}else{state = '';}
                        if(city){city = city.name + ","}else{city = '';}
                        document.getElementById("main").removeChild(document.getElementById("main").lastChild);
                        place("Lives in : " + city + " " + state + " " + country.name);
                    }

                    place("");
                    var loader = document.createTextNode("[Loading recent playtime information]");
                    document.getElementById("main").appendChild(loader);
                    
                    $.getJSON("http://localhost:3000//?sid=", {sid:sid, flag:2}, function(result){
                        console.log(result);
                        loader.parentNode.removeChild(loader);
                        if (result.response.games){
                            
                            place("Recently Played Games:");
                            place("");
                            
                            var games = result.response.games;
                            for(var i=0; i<games.length; i++){
                                var src = "http://media.steampowered.com/steamcommunity/public/images/apps/"+ games[i].appid + "/" + games[i].img_logo_url + ".jpg";
                                console.log(src);
                                place(games[i].name);
                                document.getElementById("main").appendChild(newImage(src));                        
                                place("");
                                place("Last two weeks played : " + games[i].playtime_2weeks + "minutes" );
                                place("Total playtime : " + games[i].playtime_2weeks + "minutes");
                                place('');
                            }
                        }else{
                            place("No recently played games")
                        }
                    });
                
                });
                

            });
        });
    }