'use strict';
var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('newsletter', {
        status: {
          type: Sequelize.STRING,
            validate: {
                isIn: [
                    ["Pending", "Completed"]
                ]
            }
        },
        runDate: {
            type: Sequelize.DATE,
            defaultValue: function(){
                return new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
            }
        },
    });  
};
