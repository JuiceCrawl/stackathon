'use strict';
var path = require('path');
var http = require('http');
var request = require('request');
var querystring = require('querystring')
var chalk = require('chalk');
var router = require('express').Router();
var db = require('../../db');
var Classmates = db.model('user');
var Messages = db.model('message');
var Newsletter = db.model('newsletter');
var Cohort = db.model('cohort');
var Bluebird = require('bluebird');
var cron = require('node-cron');
var IPAddress = '127.0.0.1';
var utils = require('../utils/utils');
var io = require('../../io')();

//console.log('IO', io);

var task = cron.schedule('* * * * *', function() {
  //console.log('will execute every minute until stopped');
  utils.findOverdueNewsletters();
  utils.findOverdueCohorts();
});
task.start();

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
    //console.log(' 1 FOUND COHORT', cohort)
    cohort = cohort;
    cohortId = cohort.dataValues.id;
    return cohort;
  })
  .then(function(cohort){
    //console.log('2 FOUND COHORT', cohort)
    return Newsletter.create({  
        sendDate: Date.now(),
        cohortId : cohortId,
        // cohortName : req.body.cohort,
        status: 'Pending'
    })
  })
  .then(function(news){
    newsletterId = news.dataValues.id;
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
    peopleObj.forEach(person => utils.sendAnEmail(person, newsletterId, cohortId));

    res.sendStatus(201);
  })
  .catch(next);

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

// get and join most recent messages by newsletterId
router.get('/messages/:id', function(req, res, next){
  var cohortName, cohortId, finalTemplate; 

  Newsletter.findOne({
    where: {
      id : req.params.id
    }
  })
  .then(function(foundNews) {
      return foundNews.update({
        status: "Completed"
      })
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
    var classEmailList = classmates.map(e => e.dataValues.email);

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
          console.log(chalk.magenta("MESSAGE SENT: ", info.response));
      });
    });
    res.sendStatus(201);
  });
});

router.get('/newsletters', function(req, res, next){
  Newsletter.findAll()
  .then(function(news){
    var newsletters = news.map(n => n.dataValues);
     //console.log('NEWS',newsletters)
    res.status(200).send(newsletters);
  });
});

router.get('/cohorts', function(req, res, next){
  Cohort.findAll()
  .then(function(cohort){
    var cohorts = cohort.map(c => c.dataValues);
     //console.log('NEWS',newsletters)
    res.status(200).send(cohorts);
  });
});

router.put('/cohorts', function(req, res, next){
  Cohort.findById(req.body.id)
  .then(function(foundCohort){
    return foundCohort.update({
      frequency: req.body.frequency,
      runDate: req.body.runDate
    });
  })
  .then(function(cohort){
    res.status(200).send(cohort);
  })
});

router.post('/cohorts', function(req, res, next){
  Cohort.create(req.body)
  .then(function(cohort){
    res.status(200).send(cohort);
  })
});

router.get('/cohort/:id', function(req, res, next){
  console.log('inside')
  Cohort.findById(req.params.id)
  .then(function(cohort){
    res.status(200).send(cohort.dataValues);
  });
});

router.get('/cohort/:id/classmates', function(req,res, next){
  Classmates.findAll({
    where: {
      cohortId : req.params.id
    }
  })
  .then(function(classmates){
    var classList = classmates.map(e => e.dataValues);
    //console.log(classList)
    res.status(200).send(classList);
  })
});

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});


