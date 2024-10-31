'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Spot,{
        foreignKey: 'ownerId',
        as: 'Spots'
      });

      User.hasMany(models.Booking,{
        foreignKey: 'userId',
        as: 'Bookings'
      });

      User.hasMany(models.Review,{
        foreignKey: 'userId',
        as: 'Reviews'
      });
    }
  }

  User.init(
    {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.');
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true,
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
      firstName:{
        type:DataTypes.STRING(250),
      },
      lastName:{
        type:DataTypes.STRING(250)
      }
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
        },
      },
    }
  );
  return User;
};
