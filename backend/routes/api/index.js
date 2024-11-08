//IMPORTS AND REQUIREMENTS

const sessionRouter = require('./session.js');

const reviewsRouter = require('./reviews.js')

const usersRouter = require('./users.js');

const spotsRouter = require('./spots.js');

const router = require('express').Router();

const { setTokenCookie } = require('../../utils/auth.js');

const { User } = require('../../db/models');

const { restoreUser } = require('../../utils/auth.js');

//API FOLDER CONNECTION TEST (front-end test for MOD5 )
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
});

//SET TOKEN COOKIE TEST (from utils/auth.js)
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

//RESTORE-USER TEST (from utils/auth.js)
//!unsure about placement of restore user
router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

//MIDDLEWARE/ROUTE CONNECTIONS
router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/reviews', reviewsRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
