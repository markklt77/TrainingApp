'use strict';

const { Workout } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Workout.bulkCreate([
      {
        userId: 1,
        focus: 'arms'
      },
      {
        userId: 2,
        focus: 'legs'
      },
      {
        userId: 3,
        focus: 'Chest and Back'
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Workouts';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3]}
    }, {})
  }
};
