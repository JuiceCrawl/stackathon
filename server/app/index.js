'use strict';
var path = require('path');
var express = require('express');
var app = express();
var db = require('../db');
var Classmates = db.model('user');

module.exports = function (db) {

    // Pass our express application pipeline into the configuration
    // function located at server/app/configure/index.js
    require('./configure')(app, db);

    // Direct classmate to template, she is directed here after clicking her email link

app.use('/', function(req, res, next){
      // io.emit('connection',function(socket){
      //     console.log('in updateme')
      // });
    if(req.query.from || req.query.newsletterId){
        //always check for update newsletter.
        if(!req.session.newsId || req.query.newsletterId){
            req.session.newsId = req.query.newsletterId;
        }
          
        if(!req.session.userId){
            Classmates.findOne({
                where: {
                  email: req.query.from
                }
            })
            .then(function(user){
                req.session.userId = user.dataValues.id; //asign by user's Id
            })
            .then(function(){
                 console.log('SESSION',req.session) 
                next();
            })     
        }else{
            console.log('SESSION',req.session) 
            next();
        }
    }else{
       next();  
    }
       
});


    // Routes that will be accessed via AJAX should be prepended with
    // /api so they are isolated from our GET /* wildcard.
    app.use('/api', require('./routes'));


    /*
     This middleware will catch any URLs resembling a file extension
     for example: .js, .html, .css
     This allows for proper 404s instead of the wildcard '/*' catching
     URLs that bypass express.static because the given file does not exist.
     */
    app.use(function (req, res, next) {

        if (path.extname(req.path).length > 0) {
            res.status(404).end();
        } else {
            next(null);
        }

    });

    app.get('/*', function (req, res) {
        res.sendFile(app.get('indexHTMLPath'));
    });

    // Error catching endware.
    app.use(function (err, req, res, next) {
        console.error(err);
        console.error(err.stack);
        res.status(err.status || 500).send(err.message || 'Internal server error.');
    });

    return app;

};

