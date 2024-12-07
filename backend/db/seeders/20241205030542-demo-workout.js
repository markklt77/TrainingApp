

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
        sets: 2,
        reps: 8,
        weight: 185,
        workoutId: 3
      },
      {
        exerciseTypeId: 2,
        sets: 2,
        reps: 12,
        weight: 400,
        workoutId: 2
      },
      {
        exerciseTypeId: 3,
        sets: 2,
        reps: 12,
        weight: 225,
        workoutId: 3
      },
      {
        exerciseTypeId: 4,
        sets: 2,
        reps: 5,
        weight: 405,
        workoutId: 2
      },
      {
        exerciseTypeId: 5,
        sets: 2,
        reps: 12,
        weight: 40,
        workoutId: 1
      },
      {
        exerciseTypeId: 6,
        sets: 3,
        reps: 12,
        weight: 62.5,
        workoutId: 1
      },
      {
        exerciseTypeId: 6,
        sets: 2,
        reps: 25,
        weight: 30,
        workoutId: 1
      },
      {
        exerciseTypeId: 1,
        sets: 3,
        reps: 10,
        weight: 235,
        workoutId: 3
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
