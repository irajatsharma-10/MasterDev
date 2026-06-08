const express = require('express');
const router = express.Router();

const {login , signUp, changePassword} = require('../Controllers/Auth');

const {resetPassword, resetPasswordToken} = require('../Controllers/ResetPassword');


const {auth} = require('../Middleware/auth');

router.post('/login',login);
router.post('/signup',signUp);
// password change krne k liye Authorization required hogi
router.post('/changepassword',auth,changePassword);

router.post('/reset-password-token',resetPasswordToken);

router.post('/reset-password',resetPassword);

module.exports = router;

