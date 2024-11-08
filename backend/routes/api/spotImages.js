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
const { Spot, Review, SpotImage, User } = require('../../db/models');
//creates a new router for this route
const router = express.Router();

const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');




//delete a spot Image

router.delete('/:imageId', requireAuth, async (req, res) => {
    const spotImageId = req.params.imageId

    const spotImageToDelete = await SpotImage.findByPk(spotImageId, {
        include:{
            model:Spot,
            as:'Spot',
            attributes:["ownerId"]

        }
    })
    //console.log(` TEST TEST TEST ${spotImageToDelete.ownerId}`)

    if(!spotImageToDelete) {
        return res.status(404).json({message: "Spot Image could not  be found"})
    }

    if (spotImageToDelete.Spot.ownerId !== req.user.id){
        return res.status(401).json('Unauthorized');
    }

    await spotImageToDelete.destroy();



    return res.status(200).json({message:"Successfully deleted"})


})



module.exports = router
