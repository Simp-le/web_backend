const { createProject, getAllProject, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');
const { authentication, restrictTo } = require('../controllers/authController');
const router = require('express').Router();

router.route('/').post(authentication, restrictTo('1'), createProject).get(authentication, restrictTo('1'), getAllProject); // 0 is admin, 1 is user
router.route('/:id').get(authentication, restrictTo('1'), getProjectById).patch(authentication, restrictTo('1'), updateProject).delete(authentication, restrictTo('1'), deleteProject);

module.exports = router;
