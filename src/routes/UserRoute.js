const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();

router.post("/register", userController.signUp);
router.post("/login", userController.signIn);

module.exports = router;
