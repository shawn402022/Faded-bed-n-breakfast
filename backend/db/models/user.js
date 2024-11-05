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

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:{
          "username":"user with that username already exists"
        },
        validate: {
          validUserName(value) {
            if(!value) {
              throw new Error('Username is required');
            }
          },
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
        unique: {
          "email":"user with that email already exists"
        },
        validate: {
          notEmpty: {
            "email": " invalid email"
          },
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
        allowNull:false,
        type:DataTypes.STRING(250),
        validate:{
          notEmpty: {
            msg: "first name is required"
          },
        },
      },
      lastName:{
        allowNull:false,
        type:DataTypes.STRING(250),
        validate:{
          notEmpty: {
            msg:"last name is required"
          },
        },
      },
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
