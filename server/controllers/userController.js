const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('../models/User');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile',
      error: error.message,
    });
  }
};

/**
 * @desc    Update user profile (name, email)
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if new email is already taken by another account
    if (email && email.toLowerCase().trim() !== user.email) {
      const emailTaken = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: user._id },
      });

      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: 'This email address is already in use by another account',
        });
      }
      user.email = email.toLowerCase().trim();
    }

    if (name) {
      user.name = name.trim();
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating profile',
      error: error.message,
    });
  }
};

/**
 * @desc    Change account password
 * @route   PUT /api/users/password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while changing password',
      error: error.message,
    });
  }
};

/**
 * @desc    Upload profile picture
 * @route   POST /api/users/profile-picture
 * @access  Private
 */
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image file to upload',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove old uploaded avatar file from disk if it exists
    if (user.profilePicture && user.profilePicture.startsWith('/uploads/')) {
      const oldFilename = user.profilePicture.replace('/uploads/', '');
      const oldPath = path.join(__dirname, '..', 'uploads', oldFilename);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn('Could not delete old avatar:', e.message);
        }
      }
    }

    // Relative web URL
    const relativePath = `/uploads/${req.file.filename}`;
    user.profilePicture = relativePath;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePicture: relativePath,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Upload profile picture error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while uploading profile picture',
      error: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfilePicture,
};
