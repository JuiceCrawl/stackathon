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
        toSendDate: {
            type: Sequelize.DATE,
            defaultValue: function(){ //default is 1 month
                return new Date(new Date().getTime() + (60 * 60 * 24 * 30 * 1000));
            }
        }
    
    });
    
};
