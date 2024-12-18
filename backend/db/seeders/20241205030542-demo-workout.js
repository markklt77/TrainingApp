

'use strict';

const { Exercise } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Exercise.bulkCreate([
      {
        exerciseTypeId: 1,
        workoutId: 3,
        userId: 1
      },
      {
        exerciseTypeId: 2,
        workoutId: 2,
        userId: 2
      },
      {
        exerciseTypeId: 3,
        workoutId: 3,
        userId: 1
      },
      {
        exerciseTypeId: 4,
        workoutId: 2,
        userId: 1
      },
      {
        exerciseTypeId: 5,
        workoutId: 1,
        userId: 1
      },
      {
        exerciseTypeId: 6,
        workoutId: 1,
        userId: 1
      },
      {
        exerciseTypeId: 1,
        workoutId: 3,
        userId: 2
      },

    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Exercises';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      exerciseTypeId: { [Op.in]: [1, 2, 3, 4, 5, 6]}
    }, {})
  }
};
