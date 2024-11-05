'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpotImage.belongsTo(
        models.Spot,{
          foreignKey:"spotId",
          as:'Spot'
        }
      )
    }
  }
  SpotImage.init({
    spotId:{
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'Spot',
        key: 'id'
      }
    },
    url: DataTypes.STRING,
    preview: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'SpotImage',
  });

  //adding hooks for the avgSpotRating function in Spot model 
  // SpotImage.afterCreate(async (spotImage) => { 
  //   const image = await spotImage.getSpot();
  //   await image.assignPreview();
  // });
  
  // SpotImage.afterUpdate(async (spotImage) => { 
  //   const image = await spotImage.getSpot();
  //   await image.assignPreview();
  // });

  // SpotImage.afterDestroy(async (spotImage) => { 
  //   const image = await spotImage.getSpot();
  //   await image.assignPreview();
  // });


  return SpotImage;
};
