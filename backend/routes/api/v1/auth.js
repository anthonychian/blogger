const express = require('express');
const router = express.Router();
const Account = require('../../../models/account');
const verify = require('../../../middleware/verify');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator'); 
require('dotenv').config();
// const bodyParser = require('body-parser');
// var jsonParser = bodyParser.json();


router.post('/register', [
    check('username', 'Username must be less than 16 characters').not().isEmpty().isLength({ max: 16 }),
    check('password', 'Password must be between 6 - 50 characters').not().isEmpty().isLength({ min: 6, max: 50 }),
    check('email', 'Enter a valid email').isEmail(),
    check('firstName', 'Enter the first 16 characters of your first name').not().isEmpty().isLength({ max: 16 }),
    check('lastName', 'Enter the first 16 characters of your last name').not().isEmpty().isLength({ max: 16 }),
  ], 
  async (req, res) => { 
    // validation checks for all the input fields  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {username, password, email, firstName, lastName} = req.body

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
                res.status(201).json({
                    message: 'Account created'
                });
            }
        ).catch(
            (error) => {
                res.status(500).json({
                    error: error
                });
            }
        );
    }
    catch(error) {
        res.status(500).send(error)
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
        res.status(500).send(error)
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
        res.status(500).send(error)
    }
})


// test for authentication
router.get('/accounts', verify.authenticateToken, async (req, res) => {
    let account = await Account.findOne({ _id : req.user.user.id })
    res.json(account)
});


router.get('/find', (req, res) => {
    Account.find()
    .then(
        (account) => {
            res.status(200).json(account);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
});

router.get('/findById/:id', (req, res) => {
    Account.find({_id : req.params.id})
    .then(
        (account) => {
            res.status(200).json(account);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
});

module.exports = router;


// function authenticateToken(req, res, next) {
//     // const authHeader = req.headers['authorization']
//     // const token = authHeader && authHeader.split(' ')[1]
    
//     const token = req.cookies.token

//     // check if token has been sent   
//     if (token == null) {
//        res.sendStatus(401)
//     }
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) {
//             res.sendStatus(403)
//         }
//         req.user = user
//         next()
//     })
// }