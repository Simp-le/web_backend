const { authentication, restrictTo } = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');
const router = require('express').Router();

router.route('/').get(authentication, restrictTo('0'), getAllUsers);

module.exports = router;
