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
        as: 'ReviewUser'
      });
      Review.hasMany(models.ReviewImages,
        {
          foreignKey:'reviewId',
          as: 'ReviewImages'
        }
      );
      Review.belongsTo(models.Spot,
        {
          foreignKey:'spotId',
          as: 'ReviewSpot'
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
      allowNull: false
    }
  }
  , {
    sequelize,
    modelName: 'Review',
  });

  //adding hooks for the avgSpotRating function in Spot model 
  // Review.afterCreate(async (review) => { 
  //   const spot = await review.getSpot();
  //   await spot.findAverageRating();
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
