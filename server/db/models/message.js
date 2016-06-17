'use strict';
var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('message', {
        body: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    });
    
};

