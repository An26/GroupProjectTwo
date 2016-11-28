'use strict';
module.exports = function(sequelize, DataTypes) {
  var education = sequelize.define('education', {
    schoolName: DataTypes.STRING,
    location: DataTypes.STRING,
    major: DataTypes.STRING,
    degree: DataTypes.STRING,
    years: DataTypes.STRING,
    GPA: DataTypes.STRING,
    honors: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return education;
};