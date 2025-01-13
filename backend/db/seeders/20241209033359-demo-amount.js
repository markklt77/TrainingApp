'use strict';

const { Amount }= require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Amount.bulkCreate([
      {
        foodTypeId: 1,
        userId: 1,
        quantity: '2 eggs',
        calories: 140
      },
      {
        foodTypeId: 3,
        userId: 2,
        quantity: '200 grams',
        calories: 500
      },
      {
        foodTypeId: 5,
        userId: 2,
        quantity: '1 cup',
        calories: 150
      },
      {
        foodTypeId: 6,
        userId: 3,
        quantity: '16 oz',
        calories: 500
      },
      {
        foodTypeId: 2,
        userId: 1,
        quantity: '2 scoops',
        calories: 300
      },
      {
        foodTypeId: 4,
        userId: 3,
        quantity: '3 servings',
        calories: 450
      },

    ], { validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Amounts';
    const Op = Sequelize.Op;
    queryInterface.bulkDelete(options, {
      foodTypeId: { [Op.in]: [1, 2, 3, 4, 5, 6]}
    }, {})
  }
};
