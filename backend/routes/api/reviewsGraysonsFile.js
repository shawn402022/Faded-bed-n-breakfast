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
const { Spot, Review, SpotImage, User, ReviewImages} = require('../../db/models');
//creates a new router for this route
const router = express.Router();

const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');

//Edit Review MiddleWare
const validateReviewUpdate = [
    check('review')
        .optional()
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check('stars')
        .optional()
        .isFloat({min: 0, max:5})
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

//Edit a Review
router.patch('/:reviewId', requireAuth, validateReviewUpdate, async (req,res) => {
    //get reviewId from url
    const reviewId = req.params.reviewId;

    //find the review
    const foundReview = await Review.findByPk(reviewId);
    if(!foundReview) res.status(404).json({message: "Review couldn't be found"});
    
    //check autherization
    if(foundReview.userId !== req.user.id) res.status(401).json({unautherized:'Review must belong to the current user'});

    //grab data from req
    const {review, stars} =req.body;
    //update the review
    await foundReview.update({review, stars});

    res.status(200).json(foundReview);
});

//Delete a Review
router.delete('/:reviewId', requireAuth, async (req,res) => {
    //get reviewId from url
    const reviewId = req.params.reviewId;

    //find the review
    const foundReview = await Review.findByPk(reviewId);
    if(!foundReview) res.status(404).json({message: "Review couldn't be found"});
    
    //check autherization
    if(foundReview.userId !== req.user.id) res.status(401).json({unautherized:'Review must belong to the current user'});

    //delete the review
    await foundReview.destroy()
    return res.status(200).json({message: "Successfully deleted"})
});

module.exports = router;