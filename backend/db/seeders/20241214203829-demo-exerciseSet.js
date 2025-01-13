'use strict';


const { ExerciseSet }= require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ExerciseSet.bulkCreate([
      {
        exerciseId: 1,
        sets: 2,
        reps: 8,
        weight: 200,
      },
      {
        exerciseId: 1,
        sets: 1,
        reps: 6,
        weight: 235,
      },
      {
        exerciseId: 2,
        sets: 3,
        reps: 10,
        weight: 400
      },
      {
        exerciseId: 3,
        sets: 1,
        reps: 25,
        weight: 135
      },
      {
        exerciseId: 3,
        sets: 2,
        reps: 8,
        weight: 225
      },
      {
        exerciseId: 4,
        sets: 1,
        reps: 8,
        weight: 315
      },
      {
        exerciseId: 4,
        sets: 1,
        reps: 8,
        weight: 365
      },
      {
        exerciseId: 4,
        sets: 1,
        reps: 5,
        weight: 405
      },
      {
        exerciseId: 5,
        sets: 3,
        reps: 12,
        weight: 40
      },
      {
        exerciseId: 6,
        sets: 2,
        reps: 15,
        weight: 52.5
      },
      {
        exerciseId: 6,
        sets: 2,
        reps: 12,
        weight: 65
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ExerciseSets';
    const Op = Sequelize.Op;
    queryInterface.bulkDelete(options, {
      exerciseId: { [Op.in]: [1, 2, 3, 4, 5, 6]}
    }, {})
  }
};
