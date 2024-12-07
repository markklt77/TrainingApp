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
        name: 'Lat Pulldowns'
      },
      {
        name: 'Leg Press'
      },
      {
        name: 'Barbell Benchpress'
      },
      {
        name: 'Barbell Squats'
      },
      {
        name: 'Dumbell Bicep Curls'
      },
      {
        name: 'Vulcan Attachment Cable Tricep Extensions'
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
