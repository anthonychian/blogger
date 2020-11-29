// TO DO: 
// Finish login route
// Add middleware
// Add validation

const express = require('express');
const router = express.Router();
const Account = require('../../../ models/account')
require('dotenv').config()

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const { check, validationResult } = require('express-validator'); 

const jwt = require('jsonwebtoken');
const { read } = require('fs');
//router.use(express.json())



router.post('/register', [
    check('username', 'Username must be less than 16 characters').isLength({ max: 16 }),
    // note: isLength() min: is not working
    check('password', 'Password must be between 6 - 50 characters').isLength({ max: 50 }),
    // note: isEmail() is not working
    check('email', 'Enter a valid email'),
    check('firstName', 'Enter the first 16 characters of your first name').isLength({ max: 16 }),
    check('lastName', 'Enter the first 16 characters of your last name').isLength({ max: 16 }),
    check('imgUrl', 'Image URL cannot be more than 50 characters').isLength({ max: 50 }),
  ], 
  jsonParser,
  async (req, res) => { 
    // validation checks for all the input fields  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {username, password, email, firstName, lastName, imgUrl} = req.body

    // hash the password needs to be done still 

    let findUsername = await Account.findOne({ username })
    let findEmail = await Account.findOne({ email })

    if (!findUsername && !findEmail) {
        var account = new Account({
            username,
            password,
            email,
            firstName,
            lastName,
            imgUrl
        });

        await account.save().then(
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
    else if (findUsername && !findEmail)  {
        res.status(400).json({
            username_error: 'The username: ' + username + ' is already taken'
        });
    }
    else if (!findUsername && findEmail)  {
        res.status(400).json({
            email_error: 'The email: ' + email + ' is already taken'
        });
    }
    else if (findUsername && findEmail)  {
        res.status(400).json({
            username_error: 'The username: ' + username + ' is already taken',
            email_error: 'The email: ' + email + ' is already taken'
        });
    }

});




router.post('/login', [
    check('username', 'Username is required'),
    check('password', 'Password is required')
  ], 
  jsonParser,
  async (req, res) => { 
    // validation checks for all the input fields  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // password still needs to be done
    const {username, password} = req.body

    let account = await Account.findOne({ username })

    if (account) {
        const payload = {
            user: {
                id: account.id
            }
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
        res.json({ accessToken })
    }
    else {
        res.status(400).json({
            message: 'The username ' + username + ' does not exist'
        });
    }

});

// test for authenticate works!
router.get('/accounts', authenticateToken, async (req, res) => {
    let account = await Account.findOne({ id : req.user.id })
    res.json(account)
});


router.get('/find', (req, res) => {
    Account.find().then(
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


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // check if token has been sent   
    if (token == null) {
       res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403)
        }
        req.user = user
        next()
    })
}






// const bodyParser = require('body-parser');
// var jsonParser = bodyParser.json();

// router.post('/register', jsonParser, (req, res) => {
//     const {username, password, email, firstName, lastName, imgUrl} = req.body
//     var account = new Account({
//         username,
//         password,
//         email,
//         firstName,
//         lastName,
//         imgUrl
//     });
//     account.save().then(
//         () => {
//             res.status(201).json({
//                 message: 'Account created'
//             });
//         }
//     ).catch(
//         (error) => {
//             res.status(500).json({
//                 error: error
//             });
//         }
//     );
// });