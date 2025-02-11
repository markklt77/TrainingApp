'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Workout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Workout.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      Workout.hasMany(models.Exercise, {
        foreignKey: 'workoutId'
      })
      Workout.belongsTo(models.WorkoutType, {
        foreignKey: 'workoutTypeId'
      })
    }
  }
  Workout.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    workoutTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:  {
        model: 'WorkoutTypes',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    current: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Workout',
  });
  return Workout;
};
