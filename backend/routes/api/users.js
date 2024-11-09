//IMPORTS AND REQUIREMENTS

//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express');
//Used for hashing passwords
const bcrypt = require('bcryptjs');
//imports key functions from utils/auth.js. setTokenCookie creates JWT token, requireAuth verifies 'user' from a token
const { setTokenCookie, requireAuth } = require('../../utils/auth');
//imports user model
const { User, Spot, Review, SpotImage, ReviewImages,Booking } = require('../../db/models');

//creates a new router for this route
const router = express.Router();

const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');
const { where } = require('sequelize');

//Get all Spots owned by the Current User
router.get('/:userId/spots', requireAuth, async (req,res) =>{
  //get user id from rq.params
  const id = req.params.userId;
  //get the users spots
  const foundSpots = await Spot.findAll({
    where:{ownerId: id}
  });

  res.json(foundSpots);
});

//Get all of the Current User's Bookings
router.get('/:userId/bookings', requireAuth, async (req,res) => {
  //get user id from rq.params
  const id = req.params.userId;
  //get all bookings with that userId
  const foundBookings = await Booking.findAll({
    where:{userId: id},
    include:[{model:Spot, as: 'BookingSpot', attributes:{exclude:['avgRating', 'createdAt', 'updatedAt','description']}}] // <--- eager loading
  });
  //check if bookings exist
  if(foundBookings.length === 0) res.status(404).json({message:"No bookings for this User"})

  res.status(200).json({Bookings:foundBookings});
});

//sign up middleware
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Username is required.'),
  check('username')
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({checkFalsy:true})
    .withMessage('firstName is required'),
  check('lastName')
    .exists({checkFalsy:true})
    .withMessage('lastName is required'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
    console.log(safeUser)

    await setTokenCookie(res, safeUser);


    return res.status(201).json({
      user: safeUser
    });
  }
);

//Get all Reviews of the current user
router.get('/:userId/reviews', requireAuth, async(req, res) => {
  const userId = req.params.userId;
  const reviews = await Review.findAll({
    where: { userId: userId },
    attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
    include: [
      {
        model: User, as : 'ReviewUser',
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot, as:'ReviewSpot',

        attributes: [
          'id', 'ownerId', 'address', 'city', 'state', 'country',
          'lat', 'lng', 'name', 'price',
        ],
        include: [{
          model: SpotImage, as :'SpotImages',
          attributes: ['url'],
        },
      ]
      },
      {
        model: ReviewImages, as: 'ReviewImages',
        attributes: ['id', 'url']
      }
    ]
  });

  // Format the response
  const formattedReviews = reviews.map(review => {
    const reviewJSON = review.toJSON();
    if (reviewJSON.Spot && reviewJSON.Spot.previewImage?.[0]) {
      reviewJSON.Spot.previewImage = reviewJSON.Spot.previewImage[0].url;
    }
    return reviewJSON;
  });

  return res.status(200).json({ Reviews: formattedReviews });
});


router.get('/test', async (req,res) => {
  const fTable = await Review.findAll({
    include: [
      {
        model: Spot, as : 'ReviewSpot',
      }
    ]
  })

  return res.json(fTable)
})



module.exports = router
