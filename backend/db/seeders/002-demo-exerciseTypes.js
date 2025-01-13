'use strict';

const { ExerciseType } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ExerciseType.bulkCreate([
      {
        name: 'Lat Pulldowns',
        userId: 1
      },
      {
        name: 'Leg Press',
        userId: 1
      },
      {
        name: 'Barbell Benchpress',
        userId: 1
      },
      {
        name: 'Barbell Squats',
        userId: 1
      },
      {
        name: 'Dumbell Bicep Curls',
        userId: 1
      },
      {
        name: 'Vulcan Attachment Cable Tricep Extensions',
        userId: 1
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ExerciseTypes';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Lat Pulldowns', 'Leg Press', 'Barbell Benchpress', 'Barbell Squats', 'Dumbell Bicep Curls', 'Vulcan Attachment Cable Tricep Extensions']}
    }, {})
  }
};
