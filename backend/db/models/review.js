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
      Review.belongsTo(models.User,{
        foreignKey: 'userId',
        as: 'ReviewUser',
        onDelete: 'CASCADE'
      });
      Review.hasMany(models.ReviewImages,
        {
          foreignKey:'reviewId',
          as: 'ReviewImages',
          onDelete: 'CASCADE' 
        }
      );
      Review.belongsTo(models.Spot,
        {
          foreignKey:'spotId',
          as: 'ReviewSpot',
          onDelete: 'CASCADE'
        }
      );
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    review: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    stars: {
      type: DataTypes.DECIMAL(2,1),
      allowNull: false,
      validate: {
        isDecimal: true,
        min:0,
        max: 5,
        only2Digits(value) {
          if (value * 10 % 1 !== 0) throw new Error('Stars can have at most one decimal place');
        }
      }
    }
  }
  , {
    sequelize,
    modelName: 'Review',
  });

  //adding hooks for the avgSpotRating function in Spot model 
  // Review.afterCreate(async (review) => { 
  //   const spot = await Spot.findByPk(review.spotId)
  //   await spot.findAvgRating();
  // });
  
  // Review.afterUpdate(async (review) => {
  //   const spot = await review.getSpot();
  //   await spot.findAverageRating();
  // });
  
  // Review.afterDestroy(async (review) => {
  //   const spot = await review.getSpot();
  //   await spot.findAverageRating();
  // });
  
  return Review;
};
