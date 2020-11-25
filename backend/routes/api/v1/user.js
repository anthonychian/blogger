const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;

const userRoutes = require('./routes/user')

app.use('/api/auth', userRoutes)