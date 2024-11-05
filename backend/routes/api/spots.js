//IMPORTS AND REQUIREMENTS

//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express');
//importing Operator object - used for complex queries.
const { Op } = require('sequelize');
//Used for hashing passwords
const bcrypt = require('bcryptjs');
//imported from utils/auth.js. setTokenCookie creates JWT token, restoreUsers verifies the token sent in the request
const { setTokenCookie, restoreUser } = require('../../utils/auth');
//Import the user model
const { Spot, Review, SpotImage, User } = require('../../db/models');
//creates a new router for this route
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//get all spots
router.get('/', async (req,res)=> {

    //get all spots
    const allSpots = await Spot.findAll()

    res.status(200).json(allSpots)
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
    })


    console.log(`TEST TEST TEST ${spotDetails.owner}`)

    if(!spotDetails)res.status(404).json({message:"Spot couldn't be found"})

    //add numReviews to the response
    const responseData = spotDetails.toJSON();
    responseData.numReviews = spotDetails.Reviews.length

    res.status(200).json(responseData)

})

//Edit a spot
router.put('/spotId',async(req, res) => {
    const spotIdParam = req.params.spotId;
} )
module.exports = router;
