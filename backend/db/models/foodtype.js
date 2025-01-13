'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FoodType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FoodType.hasMany(models.Amount, {
        foreignKey: 'foodTypeId',
        onDelete: 'CASCADE'
      })
    }
  }
  FoodType.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'FoodType',
  });
  return FoodType;
};
