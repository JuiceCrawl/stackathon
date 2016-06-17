'use strict';
var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('cohort', {
        name: {
            type: Sequelize.TEXT,
        }
    });
    
};