const express = require('express');
const router = express.Router();
const Blog = require('../../../models/blog')

// create blog
router.post('/create', (req, res, next) => {

});

// display all the blogs
// check if the blog has been delete
// check if the account has been deleted
router.get('/', (req, res, next) => {

});

// get a specific blog (_id in mongodb)
router.get('/:id', (req, res, next) => {

});

// update
router.put('/:id', (req, res, next) => {

});

// delete
router.delete('/:id', (req, res, next) => {

});

module.exports = router;