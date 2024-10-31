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
        models.Spots,{
          foreignKey:"spotId",
          as:'Spot'
        }
      )
    }
  }
  SpotImage.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
    spotId:{
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    url: DataTypes.STRING,
    preview: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};
