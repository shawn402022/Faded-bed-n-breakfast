//IMPORTS AND REQUIREMENTS

//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express');
//Used for hashing passwords
const bcrypt = require('bcryptjs');
//imports key functions from utils/auth.js. setTokenCookie creates JWT token, requireAuth verifies 'user' from a token
const { setTokenCookie, requireAuth } = require('../../utils/auth');
//imports user model
const { User, Spot } = require('../../db/models');
//creates a new router for this route
const router = express.Router();

const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');

//Get all Spots owned by the Current User
router.get('/:userId/spots', requireAuth, async (req,res,next) =>{
  //get user id from rq.params
  const id = req.params.userId
  //get the users spots
  console.log('ID = ', id)
  const foundSpots = await Spot.findAll({
    where:{ownerId: id}
  })
  
  res.json(foundSpots)
})

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

module.exports = router;
