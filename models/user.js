'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    street: DataTypes.STRING,
    rest: DataTypes.STRING,
    github: DataTypes.STRING,
    summary: DataTypes.TEXT,
    skills: DataTypes.TEXT,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        user.hasMany(models.education, {onDelete: 'cascade', hooks:true});
        user.hasMany(models.project, {onDelete: 'cascade', hooks:true});
        user.hasMany(models.work, {onDelete: 'cascade', hooks:true});
      }
    }
  });
  return user;
};