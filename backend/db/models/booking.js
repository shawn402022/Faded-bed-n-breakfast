'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User,{
        foreignKey: 'userId',
        as: 'BookingUser',
        onDelete: 'CASCADE'
      });
      Booking.belongsTo(models.Spot,{
        foreignKey: 'spotId',
        as: 'BookingSpot',
        onDelete: 'CASCADE'
      });
    }
  }
  Booking.init({
    
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'Spot',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};