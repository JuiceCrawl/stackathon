'use strict';
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
  //find all cohort mates or emails from db
  //but this route is written for just one, modify for all
  Classmates.findAll()
  .then(function(cohortMates){
    console.log(cohortMates)
    var mailOptions = {
        from: "1604GHA",
        to: cohortMates.email,
        subject: "Would love to get an update from you!",
        text: `Hi ${cohortMates.name} - would love to get an update from you!`
    };

  transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log("Message Sent: ", info.response);
    });
    res.sendStatus(201);
  });
});

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
