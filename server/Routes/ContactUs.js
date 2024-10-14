const express = require('express');
const router = express.Router();
const {ContactUs} = require('../Controllers/ContactUs');

// Define the route for the contact us form
router.post("/contactus", ContactUs);

module.exports = router;
