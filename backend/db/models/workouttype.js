'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkoutType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WorkoutType.hasMany(models.Workout, {
        foreignKey: "workoutTypeId"
      })
      WorkoutType.belongsTo(models.User, {
        foreignKey: "userId"
      })
    }
  }
  WorkoutType.init({
    focus: {
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
    modelName: 'WorkoutType',
  });
  return WorkoutType;
};
