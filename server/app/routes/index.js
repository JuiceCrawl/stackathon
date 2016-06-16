'use strict';
var path = require('path');
var router = require('express').Router();
var db = require('../../db');
var Classmates = db.model('user');

module.exports = router;

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
    service: "Gmail",
    auth: {
        user: "1604gha@gmail.com",
        pass: "gracehopper"
    }
}));

router.post('/send',function(req, res, next){
  //find all cohort mates and her emails from db
  Classmates.findAll()
  .then(function(cohortMates){

    //console.log('LOGGING', cohortMates.map(e => e.dataValues) )
    var peopleObj = cohortMates.map(e => e.dataValues)

    peopleObj.forEach(person => sendAnEmail(person));

    res.sendStatus(201);
  });
});

router.get('/updateme/', function(req, res, next){

  //find user by email - havent done anything with them yet
  Classmates.findOne({
    where: {
      email: req.query.from
    }
  })
  .then(found => found.dataValues);

  //Show template
  var indexPath = path.join(__dirname, '..', 'views', 'index.html');
  res.sendFile(indexPath);
  
});

//see text box and fillout, click button and save in DB

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});


function sendAnEmail(obj){
  // console.log('IN FUNCTION: sendAnEmail', obj)
    var mailOptions = {
        from: "1604GHA",
        to: obj.email,
        subject: "Would love to get an update from you!",
        text: `Hi ${obj.name} - would love to get an update from you!
          http://192.168.1.111:1337/api/updateme/?from=${obj.email}
        `
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log("Message Sent: ", info.response);
    });

}
