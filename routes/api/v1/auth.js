const express = require('express');
const router = express.Router();
const Account = require('../../../models/account');
const verify = require('../../../middleware/verify');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator'); 
const { route } = require('./blog');
require('dotenv').config();
// const bodyParser = require('body-parser');
// var jsonParser = bodyParser.json();


router.post('/register', [
    check('username')
        .not().isEmpty().withMessage('Username is required')
        .isLength({ max: 16 }).withMessage('Username must be less than 16 characters'),
    check('password')
        .not().isEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 50 }).withMessage('Password must be between 6 - 50 characters'),
    check('email')
        .not().isEmpty().withMessage('Email is required')
        .isEmail().withMessage('Enter a valid email'),
    check('firstName')
        .not().isEmpty().withMessage('First name is required')
        .isLength({ max: 16 }).withMessage('Enter the first 16 characters of your first name'),
    check('lastName')
        .not().isEmpty().withMessage('Last name is required')
        .isLength({ max: 16 }).withMessage('Enter the first 16 characters of your last name'),
  ], 
  async (req, res) => { 
    // validation checks for all the input fields  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const {username, password, email, firstName, lastName} = req.body

    // let {usernameInput, passwordInput, emailInput, firstNameInput, lastNameInput} = req.body

    // // sanitize body
    // const username = req.sanitize(usernameInput)
    // const password =req.sanitize(passwordInput)
    // const email = req.sanitize(emailInput)
    // const firstName =req.sanitize(firstNameInput)
    // const lastName = req.sanitize(lastNameInput)


    // search database for duplicate username/email
    try {
        let findUsername = await Account.findOne({ username })
        let findEmail = await Account.findOne({ email })
        
        if (findUsername || findEmail)  {
            return res.status(400).json({
                invalid_credentials: 'The username or email has already been taken'
            });
        }

        // hash the password before storing
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        var account = new Account({
            username,
            password: hashedPassword,
            email,
            firstName,
            lastName
        });

        await account.save()
        .then(
            () => {
                return res.status(201).json({
                    message: 'Account Creation Successful!'
                });
            }
        ).catch(
            (error) => {
                return res.status(500).json({
                    error: error
                });
            }
        );
    }
    catch(error) {
        return status(500).send(error)
    }

});




router.post('/login', [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
  ], 
  async (req, res) => { 
    // validation checks for all the input fields  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {username, password} = req.body

    // let {usernameInput, passwordInput} = req.body

    // // sanitize body
    // const username = req.sanitize(usernameInput)
    // const password =req.sanitize(passwordInput)

    try {
        // search database for account with correct username
        let account = await Account.findOne({ username: username})
        
        if (!account) {
            account = await Account.findOne({ email: username })
        }

        if (!account) {
            return res.status(400).json({
                error: 'The username/email or password you entered is incorrect'
            });
        }

        // check password
        let compareResult = await bcrypt.compare(password, account.password)

        if (compareResult) {
            // send jwt
            const payload = {
                user: {
                    id: account.id
                }
            }
            // creates token
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1hr'})
            return res.json({ accessToken })
        } 
            else {
                return res.status(400).json({
                    error: 'The username/email or password you entered is incorrect'
            });
        }
    }
    catch(error) {
        return res.status(500).send(error)
    }
});


router.put('/enable', verify.authenticateToken, async (req, res) => {
    try {
        let account = await Account.findOne({ _id : req.user.user.id })
        if (!account) {
            return res.status(400).json({
                message: 'Please login'
            });
        }
        if (account.isDelete) {
            account.isDelete = false;
            account.save();
        }
    }
    catch(error) {
        res.status(500).send(error)
    }
})

router.put('/disable', verify.authenticateToken, async (req, res) => {
    try {
        let account = await Account.findOne({ _id : req.user.user.id })
        if (!account) {
            return res.status(400).json({
                message: 'Please login'
            });
        }
        if (!account.isDelete) {
            account.isDelete = true;
            account.save();
        }
    }
    catch(error) {
       return res.status(500).send(error)
    }
})


router.get('/findById/:id', (req, res) => {
    Account.find({_id : req.params.id})
    .then(
        (account) => {
            return res.status(200).json(account);
        }
    ).catch(
        (error) => {
            return res.status(404).json({
                error: error
            });
        }
    );
})

router.get('/loggedIn', verify.authenticateToken, async (req, res) => {
    try {
        let account = await Account.findOne({ _id : req.user.user.id })
        if (!account) {
            return res.status(400).json({
                message: 'Please login'
            });
        }
        return res.status(200);
    }
    catch(error) {
       return res.status(500).send(error)
    }
});

module.exports = router;