'use strict';
module.exports = function(sequelize, DataTypes) {
  var work = sequelize.define('work', {
    companyName: DataTypes.STRING,
    location: DataTypes.STRING,
    title: DataTypes.STRING,
    years: DataTypes.STRING,
    responsibilities: DataTypes.TEXT,
    duties: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return work;
};