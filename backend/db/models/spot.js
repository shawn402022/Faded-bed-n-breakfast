'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User,{
        foreignKey: 'ownerId',
        as: 'SpotUser'
      });
      Spot.hasMany(models.SpotImage,
        {
          foreignKey:'spotId',
          as: 'SpotImages'
        }
      );
      Spot.hasMany(models.Review,
        {
          foreignKey:'spotId',
          as: 'Reviews'
        }
      );
      Spot.hasMany(models.Booking,
        {
          foreignKey:'spotId',
          as: 'SpotBooking'
        }
      );
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    address: DataTypes.STRING(256),
    city: DataTypes.STRING(256),
    state: DataTypes.STRING(256),
    country: DataTypes.STRING(256),
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: DataTypes.STRING(256),
    description: DataTypes.STRING(256),
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
