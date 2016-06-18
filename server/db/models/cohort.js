'use strict';
var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('cohort', {
        name: {
            type: Sequelize.TEXT,
        },
        frequency: {
            type: Sequelize.INTEGER, // in days
            defaultValue: 30
        },
        runDate: {
            type: Sequelize.DATE,
            defaultValue: function() { //defaults to every 30 days
                return new Date(new Date().getTime() + 60 * 60 * 24 * 30 * 1000);
            }
        }
    },{

    });
    
};