'use strict';
var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('newsletter', {
        sendDate: {
            type: Sequelize.DATE  
        }
    });
    
};
