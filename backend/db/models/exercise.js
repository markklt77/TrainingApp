'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Exercise.belongsTo(models.ExerciseType, {
        foreignKey: 'exerciseTypeId'
      });
      Exercise.belongsTo(models.Workout, {
        foreignKey: 'workoutId',
        onDelete: 'CASCADE'
      })
      Exercise.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
      Exercise.hasMany(models.ExerciseSet, {
        foreignKey: 'exerciseId',
        onDelete: 'CASCADE'
      })
    }
  }
  Exercise.init({
    exerciseTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ExcerciseTypes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    workoutId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Workouts',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
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
    modelName: 'Exercise',
  });
  return Exercise;
};
