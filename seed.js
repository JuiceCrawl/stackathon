/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
var Cohort = db.model('cohort');
var Promise = require('sequelize').Promise;

var seedCohort = function(){
    var cohort = [
        {name: '1604GHA', frequency: 30}, 
        {name: '1604FA', frequency: 7}];

    var creatingCohorts = cohort.map(cohort => Cohort.create(cohort));

    return Promise.all(creatingCohorts);
}

var seedUsers = function () {

    var users = [
        {
            name: 'Anna',
            email: 'annaegarcia@gmail.com',
            password: '123',
            isAdmin: true,
        },
        {
            name: 'Obama',
            email: 'obama@gmail.com',
            password: 'potus',
            isAdmin: false,
        }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};

db.sync({ force: true })
    .then(() => seedUsers())
    .then(() => seedCohort())
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
