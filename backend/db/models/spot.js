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
    }
  }
  Spot.init({
    id: {
      type:DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
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