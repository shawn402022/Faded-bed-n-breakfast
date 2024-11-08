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
const { Spot, Review, SpotImage, User, ReviewImages, Booking} = require('../../db/models');
//creates a new router for this route
const router = express.Router();

const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');

router.patch('/:bookingId', requireAuth, async (req,res) => {
    //get booking id from url
    const id = req.params.bookingId;
    //check if booking exits
    const foundBooking = await Booking.findByPk(id);
    if(!foundBooking) res.status(404).json({message: "Booking couldn't be found"});

    //autherize
    if (foundBooking.userId !== req.user.id) res.status(401).json('Unauthorized');

    //get info from req body and update
    const {startDate, endDate} = req.body;
    await foundBooking.update({startDate, endDate});
    res.status(200).json(foundBooking)
});

router.delete('/:bookingId', requireAuth, async (req,res) => {
    //get booking id from url
    const id = req.params.bookingId;

    //find booking
    const bookingToDelete = await Spot.findByPk(id);
    if(!bookingToDelete) res.status(404).json({message:  "Booking couldn't be found"});

    //autherize
    if (bookingToDelete.userId !== req.user.id) res.status(401).json('Unauthorized');

    await bookingToDelete.destroy();
    res.status(200).json({message: "Successfully deleted"});
});

module.exports = router;