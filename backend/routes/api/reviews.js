//IMPORTS AND REQUIREMENTS

//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express');
//importing Operator object - used for complex queries.
const { Op } = require('sequelize');
//Used for hashing passwords
const bcrypt = require('bcryptjs');
//imported from utils/auth.js. setTokenCookie creates JWT token, restoreUsers verifies the token sent in the request
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
//Import the user model
const {  Review,  ReviewImages } = require('../../db/models');
//creates a new router for this route
const router = express.Router();

const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');

//const validateAddImage = [
//    check('url')
//        .exists({ checkFalsy: true })
//        .notEmpty()
//        .withMessage('Please provide a valid Image.'),
//    handleValidationErrors
//];



//add Image to Review based on Reviews id
router.post('/:reviewId/images', requireAuth,  async (req,res) => {
    const userReview = await Review.findByPk(req.params.reviewId);
    const { url } = req.body;
    //const urlImage = '../images/m5.jpg'

    if(!userReview) {
        return res.status(404).json({message: "Review couldn't be found"});
    }

    if(userReview.userId !== req.user.id) {
        return res.status(403).json({message: "Forbidden"});
    }

    // Count existing images fpr this particular review
    const imageCount = await ReviewImages.count({
        where :{ reviewId: req.params.reviewId}
    })

    //check if the maximum number of images is reached
    if(imageCount>= 10 ){
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached"
        })
    }

    const newImage = await ReviewImages.create({
        reviewId: req.params.reviewId,
        url: url
    });

    const response = {
        id: newImage.id,
        url: newImage.url
    };
    res.status(201).json(response);


});
/*
    //check if spot exits
    const spot = await Spot.findByPk(req.params.spotId);
    if(!spot){
        return res.status(404).json({"message": "Spot couldn't be found"} );
    }
    //verify spot belongs to user
    if (spot.ownerId !== req.user.id){
        return res.status(401).json('Unauthorized');
    }
    //grab inputs from req.body

    const {url, preview} = req.body;
    //grab user ID
    const spotId = req.params.spotId
    //create new spotImage
    const newImage = await SpotImage.create({url, preview, spotId});
    //response
    const response = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    }
    res.status(201).json(response);
*/

module.exports = router;
