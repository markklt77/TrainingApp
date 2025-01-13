'use strict';

const { FoodType }= require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await FoodType.bulkCreate([
      {
        name: 'egg'
      },
      {
        name: 'whey protein'
      },
      {
        name: 'ground turkey'
      },
      {
        name: 'pasta'
      },
      {
        name: 'rice'
      },
      {
        name: 'beef'
      }

    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'FoodTypes';
    const Op = Sequelize.Op;
    queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['egg', 'whey protein', 'ground turkey', 'pasta', 'rice', 'beef']}
    }, {})
  }
};
