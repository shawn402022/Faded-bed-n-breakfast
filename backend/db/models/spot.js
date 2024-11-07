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

    async findAvgRating() {
      const allReviews = await this.getReviews();
    
      if (allReviews.length > 0) {
        const total = allReviews.reduce((sum, review) => sum + review.stars, 0);
        const avgRating = Number((total / allReviews.length).toFixed(1));
    
        // Only update if avgRating has changed
        if (this.avgRating !== avgRating) {
          this.avgRating = avgRating; // Update average rating
          await this.save(); // Save changes made to DB
        }
      } else {
        // Set default value of null if no reviews
        if (this.avgRating !== null) { // Only save if necessary
          this.avgRating = null; 
          await this.save(); 
        }
      }
    }

    static associate(models) {
      Spot.belongsTo(models.User,{
        foreignKey: 'ownerId',
        as: 'SpotUser',
        onDelete: 'CASCADE'        
      });
      Spot.hasMany(models.SpotImage,
        {
          foreignKey:'spotId',
          as: 'SpotImages',
          onDelete: 'CASCADE' 
        }
      );
      Spot.hasMany(models.Review,
        {
          foreignKey:'spotId',
          as: 'Reviews',
          onDelete: 'CASCADE' 
        }
      );
      Spot.hasMany(models.Booking,
        {
          foreignKey:'spotId',
          as: 'SpotBooking',
          onDelete: 'CASCADE' 
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
    city: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    lat: {
      type: DataTypes.STRING(256),
    },
    lng: {
      type: DataTypes.STRING(256),
    },
    name: {
      type: DataTypes.STRING(50),
    },
    description: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
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
  // Spot.afterUpdate(async (spot) => {
  //   await spot.findAvgRating();
  // });

  // //add preview image
  // Spot.afterCreate(async (spot) => {
  //   await spot.assignPreview();
  // });
  // Spot.afterUpdate(async (spot) => {
  //   await spot.assignPreview();
  // });


  return Spot;
};
