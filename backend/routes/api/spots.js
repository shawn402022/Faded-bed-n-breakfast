//IMPORTS AND REQUIREMENTS
//TEST COMMENT
//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express');
//importing Operator object - used for complex queries.
const { Op } = require('sequelize');
//Used for hashing passwords
const bcrypt = require('bcryptjs');
//imported from utils/auth.js. setTokenCookie creates JWT token, restoreUsers verifies the token sent in the request
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
//Import the user model
const { Spot, Review, SpotImage, User, ReviewImages} = require('../../db/models');
//creates a new router for this route
const router = express.Router();

const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');

//Create A spot Middleware
const validateCreate = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("city is required"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("state is required"),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage("country is required"),
    check('lat')
        .isLength({min: 6})
        .withMessage("Latitude is not valid"),
    check('lng')
        .isLength({min: 6})
        .withMessage("Longitude is not valid"),
    check('description')
        .isLength({min: 6})
        .withMessage("Description is required"),
    check('name')
        .isLength({max:50})
        .withMessage("Name must be less than 50 "),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage("Price per day is required"),
    handleValidationErrors
]

//create A Spot
router.post('/new', requireAuth, validateCreate, async (req,res) =>{
    //grab inputs from body
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    //get user id
    const ownerId = req.user.id;
    //create new spot
    const newSpot = await Spot.create({address, city, state, country, lat, lng, name, description, price, ownerId})
    console.log(newSpot.city)
    const response = {
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: newSpot.lat,
        lng: newSpot.lng,
        name: newSpot.name,
        description: newSpot.description,
        price: newSpot.price,
        createdAt: newSpot.createdAt,
        updatedAt: newSpot.updatedAt
    }
    res.status(201).json(response)
})

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images',requireAuth, restoreUser, async(req,res)=>{
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
})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req,res)=>{
    //get spotId from url
    const id = req.params.spotId;
    //check if spot exists
    const checkSpot = await Spot.findByPk(id);

    if(!checkSpot)res.status(404).json({message:"Spot couldn't be found"})
    //get all reviews for spot
    const foundReviews = await Review.findAll({
        where: {
            spotId:id
        },
        include: [
            {model: User, as: 'ReviewUser', attributes:['id', 'firstName', 'lastName']},
            {model:ReviewImages, as: "ReviewImages", attributes:['id','url']}
        ]
    });

    //check if reviews exist
    if(foundReviews.length === 0)res.status(200).json({message:"No reviews for this spot"});

    //response
    res.json({Reviews:foundReviews});
});

//Create a Review for a Spot Midddleware
const validateCreateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check('stars')
        .isFloat({min:0, max:5})
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors 
]

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateCreateReview, async (req,res)=>{
    //get spotId from url
    const spotId = req.params.spotId;
    
    //test if spot exists
    const spotTest = await Spot.findByPk(spotId,{
        include:[{model:Review, as:'Reviews', attributes:['userId'] }] 
    });
    if(!spotTest) res.status(404).json({message: "Spot couldn't be found"});
    
    //see if user already has a review
    spotTest.Reviews.forEach((id)=>{
        if(id.userId === req.user.id){
            res.status(500).json({message: "User already has a review for this spot"})
        }
    });

    //get userId from user
    const userId = req.user.id;
    //get inputs from req
    const {review, stars} = req.body;
    //create a new review
    const newReview = await Review.create({spotId, userId, review, stars});
    
    //response
    const response = {
        id: newReview.id,
        spotId: newReview.spotId,
        userId: newReview.userId,
        review: newReview.review,
        stars: newReview.stars,
        createdAt: newReview.createdAt,
        updatedAt: newReview.updatedAt
    }

    res.status(201).json(response)

})

//get details of a Spot from an Id
router.get('/:spotId', async (req,res) => {
    const spotIdParam = req.params.spotId;

    const spotDetails = await Spot.findByPk(spotIdParam, {
        include: [
            {model:SpotImage, as: 'SpotImages', attributes: ['id', 'url', 'preview'] },
            {model: Review, as: 'Reviews', attributes: ['id', 'stars']},
            {model: User, as: 'SpotUser', attributes:['id', 'firstName', 'lastName']}
        ]
    });

    if(!spotDetails)res.status(404).json({message:"Spot couldn't be found"})

    //add numReviews to the response
    const responseData = spotDetails.toJSON();
    responseData.numReviews = spotDetails.Reviews.length

    res.status(200).json(responseData)
});

const validateEdit = [
    check('address')
        .optional()
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check('city')
        .optional()
        .exists({ checkFalsy: true })
        .withMessage("city is required"),
    check('state')
        .optional()
        .exists({ checkFalsy: true })
        .withMessage("state is required"),
    check('country')
        .optional()
        .exists({ checkFalsy: true })
        .withMessage("country is required"),
    check('lat')
        .optional()
        .isLength({min: 6})
        .withMessage("Latitude is not valid"),
    check('lng')
        .optional()
        .isLength({min: 6})
        .withMessage("Longitude is not valid"),
    check('description')
        .optional()
        .isLength({min: 6})
        .withMessage("Description is required"),
    check('name')
        .optional()
        .isLength({max:50})
        .withMessage("Name must be less than 50 "),
    check('price')
        .optional()
        .exists({ checkFalsy: true })
        .withMessage("Price per day is required"),
    handleValidationErrors
]

//Edit a spot
router.put('/:spotId', requireAuth, validateEdit,async(req, res) => {
    const spotIdParam = req.params.spotId;
    const {address, city, state, country, lat,lng, name, description, price} = req.body;

    const spot = await Spot.findByPk(spotIdParam);

    if(!spot) {
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    //Check if spot belongs to current user
    if(spot.ownerId !== req.review.id) {
        return res.status(400).json({message:"bad request"})
    } else if(!validateCreate) {
        return res.status(400).json({message:"bad validate"})
    }

    //Update the spot
    await spot.update({
        address, city,
        state,country,
        lat, lng,
        name, description,
        price
    });

    return res.status(200).json(spot)
})

//delete a spot
router.delete('/:spotId', requireAuth, async(req,res) => {
    const spot = req.params.spotId;

    const spotToDelete = await Spot.findByPk(spot)

    if(!spotToDelete) {
        return res.status(404).json({message: "Spot couldn't be found"})
    }

    if (spotToDelete.ownerId !== req.user.id){
        return res.status(401).json('Unauthorized');
    }

    await spotToDelete.destroy()

    return res.status(200).json({message: "Successfully deleted"})


})

//get all spots
router.get('/', async (req,res)=> {

    //get all spots
    const allSpots = await Spot.findAll();

    res.status(200).json(allSpots);
})

module.exports = router;
