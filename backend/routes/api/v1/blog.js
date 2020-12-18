const express = require('express');
const router = express.Router();
const Blog = require('../../../models/blog');
const Account = require('../../../models/account');
const verify = require('../../../middleware/verify');
const { check, validationResult } = require('express-validator'); 


// display only users posts
router.get('/myposts', verify.authenticateToken, async (req, res) => {
    try {
        //console.log(req.user.user.id)
        let account = await Account.findOne({ _id : req.user.user.id, isDelete: "false"})
        if (!account) {
            return res.status(400).json({
                login_error: 'Please login'
            });
        }
        Blog.find({ userId : req.user.user.id, isDelete: "false" })
        .then(
            (blog) => {
                return res.status(200).json(blog);
            }
        ).catch(
            (error) => {
                return res.status(404).json({
                    error: error
                });
            }
        );
    }
    catch(error) {
        return res.status(500).send(error)
    }
});
// return current user id
router.get('/myid', verify.authenticateToken, async (req, res) => {
    
    return res.status(200).json(req.user.user.id);
});

// return list of all blogs
router.get('/', verify.authenticateToken, async (req, res) => {
    try {
        let account = await Account.findOne({ _id : req.user.user.id, isDelete: "false"})
        if (!account) {
            return res.status(400).json({
                login_error: 'Please login'
            });
        }
        Blog.find({ isDelete: "false" })
        .then(
            (blog) => {
                return res.status(200).json(blog);
            }
        ).catch(
            (error) => {
                return res.status(404).json({
                    error: error
                });
            }
        );
    }
    catch(error) {
        return status(500).send(error)
    }
});

// get a specific blog (_id in mongodb)
router.get('/:id', verify.authenticateToken, async (req, res) => {
    try {
        let account = await Account.findOne({ _id : req.user.user.id, isDelete:"false"})
        if (!account) {
            return res.status(400).json({
                login_error: 'Please login'
            });
        }
        Blog.findOne({ _id : req.params.id, isDelete: false })
        .then(
            (blog) => {
                if (blog == null) {
                    return res.status(404).json({
                        message: 'No blog post found'
                    });
                }
                return res.status(200).json(blog);
            }
        ).catch(
            (error) => {
                return res.status(404).json({
                    error: error
                });
            }
        );
    }
    catch(error) {
        console.log(122)
        return res.status(500).send(error)
    }
});

// create a new blog
router.post('/create', verify.authenticateToken, [
    check('header')
        .not().isEmpty().withMessage('Header is required')
        .isLength({ max: 100 }).withMessage('Header limit cannot exceed 100 characters'),
    check('content')
        .not().isEmpty().withMessage('Content is required')
        .isLength({ max: 10000 }).withMessage('Content limit cannot exceed 10000 characters'),
    check('coverImgUrl')
        .isURL().withMessage('Invalid URL link'),
], 
    async (req, res) => { 
        try {
            let account = await Account.findOne({ _id : req.user.user.id, isDelete: "false"})
            if (!account) {
                return res.status(400).json({
                    login_error: 'Please login'
                });
            }
        
            // validation checks for all the input fields  
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const userId = req.user.user.id
            const {header, content, coverImgUrl} = req.body

            // let {headerInput, contentInput} = req.body

            // // sanitize body
            // const header = req.sanitize(headerInput)
            // const content =req.sanitize(contentInput)

        
            var blog = new Blog({
                userId,
                header,
                content,
                coverImgUrl
            });

            await blog.save()
            .then(
                () => {
                    return res.status(201).json({
                        message: 'Blog post created'
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
            return res.status(500).send(error)
        }
});


// update an existing blog
router.put('/:id', verify.authenticateToken, [
    check('header')
        .not().isEmpty().withMessage('Header is required')
        .isLength({ max: 100 }).withMessage('Header limit cannot exceed 100 characters'),
    check('content')
        .not().isEmpty().withMessage('Content is required')
        .isLength({ max: 10000 }).withMessage('Content limit cannot exceed 10000 characters'),
    check('coverImgUrl')
        .isURL().withMessage('Invalid URL link'),
    ], 
    async (req, res) => { 
        try {
            let account = await Account.findOne({ _id : req.user.user.id, isDelete:"false"})
            if (!account) {
                return res.status(400).json({
                    login_error: 'Please login'
                });
            }

            // validation checks for all the input fields  
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const date = new Date();
            const {header, content, coverImgUrl} = req.body

            // let {headerInput, contentInput} = req.body

            // // sanitize body
            // const header = req.sanitize(headerInput)
            // const content =req.sanitize(contentInput)

            Blog.findOneAndUpdate(
                { _id : req.params.id , isDelete: false },
                {
                    header,
                    content,
                    coverImgUrl,
                    modifiedDate: date
                }
            )
            .then(
                () => {
                    return res.status(201).json({
                        message: 'Blog post updated ' + date
                    });
                }
            ).catch(
                (error) => {
                    return res.status(404).json({
                        error: error
                    });
                }
            );
        }
        catch(error) {
            return res.status(500).send(error)
        }
});

// delete an existing blog
router.delete('/:id', verify.authenticateToken, async (req, res) => {
    try {
        Blog.findOneAndUpdate(
            { _id : req.params.id , isDelete: false },
            {
                isDelete: true
            }
        )
        .then(
            () => {
                return res.status(201).json({
                    message: 'Blog post deleted'
                });
            }
        ).catch(
            (error) => {
                return res.status(404).json({
                    error: error
                });
            }
        );
    }
    catch(error) {
        return res.status(500).send(error)
    }

});

// like post
router.put('/:id/like', verify.authenticateToken, async (req, res) => { 
    try {
        let account = await Account.findOne({ _id : req.user.user.id, isDelete:"false"})
        if (!account) {
            return res.status(400).json({
                login_error: 'Please login'
            });
        }
        // find unliked blog post and like it
        Blog.findOneAndUpdate(
            { _id : req.params.id , isDelete: false },
            {
                $inc: {likes: 1},
                $push: {usersWhoLiked: req.user.user.id}
            }
        )
        .then(
            (data) => {
                return res.status(201).json(data.likes + 1)
            }
        ).catch(
            (error) => {
                return res.status(404).json({
                    error: error
                });
            }
        );
    }
    catch(error) {
        return res.status(500).send(error)
    }
});
// unlike post
router.put('/:id/unlike', verify.authenticateToken, async (req, res) => { 
    try {
        let account = await Account.findOne({ _id : req.user.user.id, isDelete:"false"})
        if (!account) {
            return res.status(400).json({
                login_error: 'Please login'
            });
        }

        // find liked blog post and unlike it
        Blog.findOneAndUpdate(
            { _id : req.params.id , isDelete: false, usersWhoLiked: {$all:[req.user.user.id]} },
            {
                $inc: {likes: -1},
                $pull: {usersWhoLiked: req.user.user.id}
            }
        )
        .then(
            (data) => {
                return res.status(201).json(data.likes - 1)
            }
        ).catch(
            (error) => {
                return res.status(404).json({
                    error: error
                });
            }
        );
    }
    catch(error) {
        return res.status(500).send(error)
    }
})

module.exports = router;