import express from 'express';
// express router object
const router = express.Router();

// user routes
router.post('/user', require('../../controllers/user').createUser);
router.put('/user/:id', require('../../controllers/user').updateProfile);

// image upload
router.post('/image', require('../../controllers/user').profileUpload);

// otp routes
router.post('/otp', require('../../controllers/user').resendOtp);
router.post('/otp/verify', require('../../controllers/user').verifyOtp); 

// contact
router.post('/contact',  require('../../controllers/user').contact);

module.exports = router; 


