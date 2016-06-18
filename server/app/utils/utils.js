var db = require('../../db');
var Classmates = db.model('user');
var Messages = db.model('message');
var Newsletter = db.model('newsletter');
var Cohort = db.model('cohort');
var Bluebird = require('bluebird');
var path = require('path');
var http = require('http');
var request = require('request');
var querystring = require('querystring')
var chalk = require('chalk');
var IPAddress = '127.0.0.1';

module.exports = {
  sendAnEmail: sendAnEmail,
  findOverdueNewsletters: findOverdueNewsletters,
  findOverdueCohorts: findOverdueCohorts
}

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
    service: "Gmail",
    auth: {
        user: "1604gha@gmail.com",
        pass: "gracehopper"
    }
}));

function sendAnEmail(obj, id){
  // console.log('IN FUNCTION: sendAnEmail', obj)
    var mailOptions = {
        from: "1604GHA",
        to: obj.email,
        subject: "Would love to get an update from you!",
        text: `Hi ${obj.name} - would love to get an update from you!
          http://${IPAddress}:1337/api/updateme/?from=${obj.email}&newsletterId=${id}
        `    
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log(chalk.magenta("Message Sent: ", info.response));
    });

}

function findOverdueNewsletters(){
  Newsletter.findAll({
    where :{
      status : 'Pending',
      runDate : {
        $lt : new Date()
      }
    }
  })
  .then(function(newsletters){
    var unProcessedIds = newsletters.map(n => n.dataValues.id);
    //console.log(newsletters)
    if(unProcessedIds.length > 0){ //if we have overdue newsletters, process them
      unProcessedIds.forEach(function(id){
        //call /messages/ + id
        var options = {
          host: IPAddress,
          port: 1337,
          path: '/api/messages/' + id,
          method: 'GET'
        };

        http.request(options, function(res) {
          //console.log('STATUS: ' + res.statusCode);
          //console.log('HEADERS: ' + JSON.stringify(res.headers));
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
          });
        }).end();
      });
    }else{
      console.log(chalk.cyan('No Newsletters need processing!'));
      return;
    }    
  });
}

function findOverdueCohorts(){
  Cohort.findAll({
    where :{
      runDate : {
        $lt : new Date()
      }
    }
  })
  .then(function(cohorts){
    cohorts.forEach(function(c){
      c.update({ //update runDate with cohort frequency
          runDate : new Date(new Date().getTime() + 60 * 60 * 24 * `${c.dataValues.frequency}` * 1000)
      })
    })
    return cohorts;
  })
  .then(function(cohorts){
    var unProcessedIds = cohorts.map(c => c.dataValues.name);
    if(unProcessedIds.length > 0){ //if we have overdue cohorts, process them
      unProcessedIds.forEach(function(name){

            //Req.Body
            var postData = querystring.stringify({
              'cohort' : name
            });

            var options = {
              host: IPAddress,
              port: 1337,
              path: '/api/send',
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
              }
            };

            var req = http.request(options, (res) => {
              // console.log(`STATUS: ${res.statusCode}`);
              // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
              res.setEncoding('utf8');
              res.on('data', (chunk) => {
                 // console.log(`BODY: ${chunk}`);
              });
              res.on('end', () => {
                // console.log('No more data in response.')
              });
            });

            req.on('error', (e) => {
              console.log(`problem with request: ${e.message}`);
            });

            // write data to request body
            req.write(postData);
            req.end();
      });
    }else{
      console.log(chalk.cyan('No Cohorts need processing!'));
      return;
    }
  });
}