'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReviewImages.belongsTo(
        models.Reviews,
        {
          foreignKey:'reviewId',
          as:'Review'
        });
    }
  }
  ReviewImages.init({
    id: DataTypes.INTEGER,
    reviewId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Review',
        key: 'id'
      }
    },
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReviewImages',
  });
  return ReviewImages;
};
