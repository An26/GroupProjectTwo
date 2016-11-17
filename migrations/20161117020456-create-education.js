'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('education', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      schoolName: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      major: {
        type: Sequelize.STRING
      },
      degree: {
        type: Sequelize.STRING
      },
      years: {
        type: Sequelize.STRING
      },
      GPA: {
        type: Sequelize.STRING
      },
      honors: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('education');
  }
};