'use strict';
var path = require('path');
var router = require('express').Router();
var db = require('../../db');
var Classmates = db.model('user');
var Messages = db.model('message');
var Newsletter = db.model('newsletter');
var Cohort = db.model('cohort');
var Bluebird = require('bluebird');
var IPAddress = '192.168.1.111';

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

//find all cohort mates from DB and her emails
router.post('/send',function(req, res, next){
  //where cohort is from req.body.cohort

  //find cohort, create newsletter, set cohort, find classmate
  var newsletterId;
  var cohortId;
  var cohort;

  Cohort.findOne({
      where : {
        name : req.body.cohort,
      }
  })
  .then(function(cohort){
    
    cohort = cohort;
    cohortId = cohort.dataValues.id;
    return cohort;
  })
  .then(function(cohort){
    //console.log('FOUND COHORT', cohort)
    return Newsletter.create({  
        sendDate: Date.now(),
        cohortId : cohortId
    })
  })
  .then(function(news){
    newsletterId = news.dataValues.id
    return Classmates.findAll({
      where : {
        cohortId : cohortId
      }
    })
  })
  .then(function(cohortMates){
    //console.log('LOGGING', cohortMates.map(e => e.dataValues) )
    var peopleObj = cohortMates.map(e => e.dataValues)
    //console.log('NEWS',newsletterId)
    peopleObj.forEach(person => sendAnEmail(person, newsletterId));

    res.sendStatus(201);
  })
  .catch(next);

});

// Direct classmate to template, she is directed here after clicking her email link
router.get('/updateme/', function(req, res, next){
  var indexFile = path.join(__dirname, '..', 'views', 'index.html');

  if(!req.session.userId){
      Classmates.findOne({
        where: {
          email: req.query.from
        }
      })
      .then(function(user){
        req.session.userId = user.dataValues.id;
        req.session.newsId = req.query.newsletterId; 
      })
      .then(function(){
        console.log('SESSION',req.session) 
        res.sendFile(indexFile);
      })     
  }else{
    console.log('SESSION',req.session) 
    res.sendFile(indexFile);
  }
  console.log('SESSION',req.session) 
 
});

// Store message with appropriate person in DB
router.post('/store', function(req, res, next){
  var message = req.body.eResponse;
  var classmateId = req.session.userId;
  var newsletterId = req.session.newsId;


  Promise.all([
    Classmates.findById(classmateId),
    Messages.create({body: message}),
    Newsletter.findById(newsletterId)
  ])
  .then(function(response) {
      var userObj = response[0];
      var messageObj = response[1];
      var newsletterObj = response[2];
      return userObj.addMessage(messageObj)
      .then(function(){
        return newsletterObj.addMessage(messageObj);
      });
  })
  .then(function(whatHappened){
    //console.log('HAPPENED',whatHappened);
    res.sendStatus(201);
  })
  .catch(next);  
  
});

// get and join most recent messages by nesletterId
router.get('/messages/:id', function(req, res, next){
  var cohortName, cohortId, finalTemplate; 

  Newsletter.findOne({
    where: {
      id : req.params.id
    }
  })
  .then(function(news){
    cohortId = news.dataValues.cohortId;
    return Cohort.findById(cohortId);
  })
  .then(function(cohort){
    cohortName = cohort.dataValues.name;
  })
  .then(function(){
    return Messages.findAll({
      where: {
        newsletterId : req.params.id
      }
    });
  })
  .then(function(message){
    //var templates = [];
    var messages = message.map(m => m.dataValues);
    //console.log(messages)
    return Bluebird.map(messages, function(m){
      return Classmates.findById(m.userId)
      .then(function(user){
        var author = user.dataValues.name;
        var body = m.body;
        var reply = `${author} - ${body}`;
        return reply;
      });
    });
  })
  .then(function(templates){
    var email = '';
     templates.forEach(function(t){
      email += t + '\n'
     });
     //console.log(email)
     finalTemplate = email;
     return email;
  })
  .then(function(email){
    //find everyong in the cohort to email
    return Classmates.findAll({
      where : {
        cohortId : cohortId
      }
    })

  })
  .then(function(classmates){
    var classEmailList = classmates.map(e => e.dataValues.email)
     //console.log('CLASSMATES',classEmailList)
    // var mailOptions = {
    //     from: cohortName,
    //     to: obj.email,
    //     subject: "Here's what your classmates have to say",
    //     text: finalTemplate 
    // };

    classEmailList.forEach(function(email){
      transporter.sendMail({
        from: cohortName,
        to: email,
        subject: "Here's what your classmates have to say",
        text: finalTemplate 
      },function(error, info) {
          if (error) {
              return console.log(error);
          }
          console.log("Message Sent: ", info.response);
      });
    });

  });
});

// Find all messages from a particular newsletter so that we can join them in 1 message


// Send joined message with some time frame, plus a button to automatically send
// /send needs to start the timer and when timer goes off needs to call function to add all messages, 1. find all messsages from people in group(in the right timeline) 2. es6 template a message for each message 3. recall /send without a timer and with other template

//how to handle finding messages based on user and based on time frame (dont want old messages), consider cohort or group too?


// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});


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
        console.log("Message Sent: ", info.response);
    });

}
