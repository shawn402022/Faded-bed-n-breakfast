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
const { Spot, Review, SpotImage } = require('../../db/models');
//creates a new router for this route
const router = express.Router();

const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');

//Creat A spot Middleware
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
router.post('/:spotId/images',requireAuth, restoreUser,(req,res)=>{
    //grab inputs from req.body
    
})

//get all spots
router.get('/', async (req,res)=> {

    //get all spots
    const allSpots = await Spot.findAll()

    res.status(200).json(allSpots)
})

module.exports = router;