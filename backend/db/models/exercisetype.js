'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExerciseType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ExerciseType.hasMany(models.Exercise, {
        foreignKey: 'exerciseTypeId',
      })
      ExerciseType.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  ExerciseType.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'ExerciseType',
  });
  return ExerciseType;
};
