'use strict';
var db = require('./_db');
module.exports = db;
require('./models/user')(db);
require('./models/message')(db);
require('./models/newsletter')(db);
require('./models/cohort')(db);

var User = db.model('user');
var Message = db.model('message');
var Newsletter = db.model('newsletter');
var Cohort = db.model('cohort');

// Message.belongsToMany(User, {through: 'responses'});
// User.belongsToMany(Message, {through: 'responses'});

Message.belongsTo(User);
User.hasMany(Message);

User.belongsTo(Cohort);

Newsletter.belongsTo(Cohort);
Cohort.hasMany(Newsletter);

Message.belongsTo(Newsletter);
Newsletter.hasMany(Message);

