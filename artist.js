//Jared Herrera
var request = require('request');
var cheerio = require('cheerio');
var nodeMailer = require('nodemailer')
var Argum = [];
Argum  = process.argv;
Argum = Argum.slice(2);
var argum = Argum.length;
var empty = false
let jsonData = require('./credentials.json');
//making sure i am reading the json Values correctly
var _from = jsonData.from;
var _to = jsonData.to;
var _sender = jsonData.sender_email;
var _pswrd = jsonData.sender_password;


if(argum == 0){
    empty = true
    console.log("No Artist was entered")
}
else{
    request('http://www.popvortex.com/music/charts/top-rap-songs.php', function(error, response,html){
        if(!error && response.statusCode == 200){
            var eArray = [];
            var $ = cheerio.load(html);
            $('p.title-artist').each(function(i,element){
                var song = ""
                if(i < 25){
                    var song_Art = $(this).text().toString();
                    
                    if(song_Art.includes(Argum[0])){
                        var song = $(this).text().replace(Argum[0], "").toString()
                        song.trim
                        eArray.push(song);
                    }
                }
                
            })
           
        }if(eArray.length == 0){
            console.log("Artist was not found: No email")
        }
        else{
            let transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth:{
                    user: _sender,
                    pass: _pswrd
                },
                tls:{
                    rejectUnauthorized: false
                }
            });
            let mailOptions = {
                from:_from,
                to: _to,
                subject: "Your artist(s) are: " + Argum.toString(),
                html:'<b>' + Argum[0] +'</b>'+ ": " + '<em>' +eArray.toString() + '<em>'
            }
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    return console.log(error);
                }
                
            });
        }
        
    });
    
}
