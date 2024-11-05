'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {

    async assignPreview(){
      //get all preview images
      const previews =await this.getSpotImages({
        where:{
          preview: true,

        },
        attributes: ['url']
      });
      //create array of urls from preview object
      const urls = previews.map(preview => preview.url)
      //assign array of urls to previewImage
      this.previewImage = urls;
      await this.save();
    }

    async findAvgRating(){
      //get all reviews for the spot
      const allReviews = await this.getReviews();
      //if their are reviews
      if (allReviews.length > 0){ //<-- cannot use !allReviews because an emty array returns truthy
        //get total sum of all reviews
        const total = allReviews.reduce((sum,review) => 
          sum + review.stars, 0)
        //find the avg and assign it to the attribute
        this.avgRating = Number((total / allReviews.length).toFixed(1));// <-- toFixed returns a string
        //save changes made to DB
        await this.save();
      } else {
        //set default value of null if no reviews
        this.avgRating = null;
        await this.save();
      }
    }

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
    address: {
      type: DataTypes.STRING(256),
      unique: {msg: 'address must be unique'}
    },
    city: DataTypes.STRING(256),
    state: DataTypes.STRING(256),
    country: DataTypes.STRING(256),
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    name: DataTypes.STRING(256),
    description: DataTypes.STRING(256),
    price: DataTypes.FLOAT,
    avgRating: {
      type: DataTypes.DECIMAL(2,1),
      validate:{
        min: 0,
        max: 5
      }
    },
    previewImage:{
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });

  //find avgRating
  Spot.afterCreate(async (spot) => {
    await spot.findAvgRating();
  });
  Spot.afterUpdate(async (spot) => {
    await spot.findAvgRating();
  });

  //add preview image
  Spot.afterCreate(async (spot) => {
    await spot.assignPreview();
  });
  Spot.afterUpdate(async (spot) => {
    await spot.assignPreview();
  });


  return Spot;
};
