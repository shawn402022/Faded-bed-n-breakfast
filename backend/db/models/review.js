'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reviews.belongsTo(models.User,{
        foreignKey: 'userId',
        as: 'ReviewUser'
      });
      Reviews.hasMany(models.ReviewImages,
        {
          foreignKey:'reviewId',
          as: 'ReviewImages'
        }
      )
    }
  }
  Review.init({
    id: {
      type:DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: DataTypes.STRING,
    stars: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
