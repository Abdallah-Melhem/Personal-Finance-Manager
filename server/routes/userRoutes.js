const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfilePicture,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Protect all user routes
router.use(protect);

router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

router.put('/password', changePassword);

router.post(
  '/profile-picture',
  upload.single('profilePicture'),
  uploadProfilePicture
);

module.exports = router;
