'use strict';
var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('cohort', {
        name: {
            type: Sequelize.TEXT,
        },
        frequency: {
            type: Sequelize.INTEGER, //freq by days to send newsletter
        },
        runDate: {
            type: Sequelize.DATE,
            defaultValue: function(name){
              
              console.log('FREQ', name)
                return new Date(new Date().getTime() + 60 * 60 * 24 * 30 * 1000);
            }
        },
    });
    
};