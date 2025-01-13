'use strict';

const { Weight }= require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Weight.bulkCreate([
      {
        weight: 200,
        userId: 1
      },
      {
        weight: 205,
        userId: 1
      },
      {
        weight: 203,
        userId: 1
      },
      {
        weight: 202,
        userId: 1
      },
      {
        weight: 199,
        userId: 1
      },
      {
        weight: 195,
        userId: 1
      },
      {
        weight: 190,
        userId: 1
      },
      {
        weight: 185,
        userId: 1
      },
      {
        weight: 150,
        userId: 2
      },
      {
        weight: 160,
        userId: 2
      },
      {
        weight: 159,
        userId: 2
      },
      {
        weight: 165,
        userId: 2
      },
      {
        weight: 170,
        userId: 2
      },
      {
        weight: 177,
        userId: 2
      },

    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Weights';
    const Op = Sequelize.Op;
    queryInterface.bulkDelete(options, {
      userId: { [Op.in] : [1, 2, 3]}
    }, {})
  }
};
