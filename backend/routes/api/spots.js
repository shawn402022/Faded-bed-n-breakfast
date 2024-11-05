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
const { Spot, Review, SpotImage } = require('../../db/models');
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

module.exports = router;