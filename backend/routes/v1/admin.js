import express from 'express';
// express router object
const router = express.Router();

// user routes
router.get('/user', require('../../controllers/user').getUsers);

module.exports = router;


