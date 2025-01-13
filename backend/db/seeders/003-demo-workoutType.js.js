'use strict';

const { WorkoutType } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await WorkoutType.bulkCreate([
      {
        focus: 'arms',
        userId: 1
      },
      {
        focus: 'Legs',
        userId: 1
      },
      {
        focus: 'Chest and Back',
        userId: 1
      },
      {
        focus: 'Shoulders',
        userId: 1
      },
      {
        focus: 'arms',
        userId: 2
      },
      {
        focus: 'Legs',
        userId: 2
      },
      {
        focus: 'Chest and Back',
        userId: 2
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'WorkoutTypes';
    const Op = Sequelize.Op;
    queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2]}
    }, {})
  }
};
