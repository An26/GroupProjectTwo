'use strict';
module.exports = function(sequelize, DataTypes) {
  var project = sequelize.define('project', {
    projectName: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.STRING,
    dates: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return project;
};