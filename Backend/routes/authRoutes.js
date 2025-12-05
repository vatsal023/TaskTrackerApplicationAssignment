//userRoute.js
const express = require("express");
const registerController = require("../Controllers/registerController");
const loginController = require("../Controllers/loginController.js");
const verifyEmail = require("../Controllers/emailverificationController");


const router = express.Router();

router.post('/register',registerController);
router.post('/login',loginController);
router.get('/:id/verify/:token',verifyEmail);


module.exports = router;



