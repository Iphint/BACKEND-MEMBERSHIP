const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const { verifyToken } = require('../middleware/AuthMiddleware');
const { admin, general } = require('../config/Auth');
const upload = require('../middleware/Upload');

// User registration route
router.post(
  '/register',
  upload.single('profile_picture'),
  UserController.register
);
router.post('/login', UserController.login);
router.get('/users', verifyToken, admin, UserController.getAllUsers);
router.get('/user/:id', verifyToken, general, UserController.findUserById);
router.put(
  '/user/:id',
  verifyToken,
  general,
  upload.single('profile_picture'),
  UserController.updateUser
);
router.delete('/user/:id', verifyToken, general, UserController.deleteUser);

module.exports = router;
