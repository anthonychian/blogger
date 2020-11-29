const mongo = require('./config/mongodb');
const express = require('express');
const app = express();

var authRouter = require('./routes/api/v1/auth');
var blogRouter = require('./routes/api/v1/blog');
var userRouter = require('./routes/api/v1/user');

mongo.connectMongoDB();

app.use('/auth', authRouter);
app.use('/blog', blogRouter);
app.use('/user', userRouter);


module.exports = app;













//const mongooseUniqueValidator = require('mongoose-unique-validator');

// app.use(bodyParser.json());
// app.use(express.urlencoded({extended: false}))
// app.use(express.static('../frontend/public'))

// add validation for endpoint
// user has to enter password (16-50 digits)
// use express validator

// app.post('/api/v1/register', (req, res, next) => {
//     // create new variable for date
//     const dateNow = new Date().getUTCDate()
//     const account = new Account({
//         // id: "12345",
//         username: req.body.input_username,
//         passwordHash: req.body.input_password,
//         email: req.body.input_email,
//         firstName: req.body.input_first_name,
//         lastName: req.body.input_last_name,
//         imgUrl: "imgUrl.jpg",
//         modifiedDate: dateNow,
//         createdDate: dateNow,
//         isDelete: false
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
// app.post('/api/v1/login', (req, res, next) => {

// });

// // for testing
// app.get('/find/:user', (req, res, next) => {
//     Account.findOne({
//         username: req.params.user
//     }).then(
//         (account) => {
//             res.status(200).json(account);
//         }
//     ).catch(
//         (error) => {
//             res.status(404).json({
//                 error: error
//             });
//         }
//     );
// });

// // for testing
// app.get('/accounts', (req, res, next) => {
//     Account.find().then(
//         (account) => {
//             res.status(200).json(account);
//         }
//     ).catch(
//         (error) => {
//             res.status(404).json({
//                 error: error
//             });
//         }
//     );
// });

// module.exports = app;