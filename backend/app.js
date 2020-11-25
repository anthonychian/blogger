const express = require('express');
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const bodyParser = require('body-parser');

const app = express();

const Account = require('./ models/account')
const Blog = require('./ models/blog')
var date = new Date();

mongoose.connect('mongodb+srv://anthony:eFfOrR9Yzg8y55Kc@cluster0.pmyzm.mongodb.net/<dbname>?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

app.use(bodyParser.json());

app.use(express.urlencoded({extended: false}))

app.use(express.static('../frontend/public'))

app.post('/api/v1/register', (req, res, next) => {
    const account = new Account({
        //id: UUID,
        username: req.body.input_username,
        passwordHash: req.body.input_password,
        email: req.body.input_email,
        firstName: req.body.input_first_name,
        lastName: req.body.input_last_name,
        imgUrl: "imgUrl.jpg",
        modifiedDate: date.getUTCDate(),
        createdDate: date.getUTCDate(),
        isDelete: false
    });
    account.save().then(
        () => {
            res.status(201).json({
                message: 'test saved'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});
app.post('/api/v1/login', (req, res, next) => {

});

app.get('/find/:user', (req, res, next) => {
    Account.findOne({
        username: req.params.user
    }).then(
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
app.get('/accounts', (req, res, next) => {
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

module.exports = app;