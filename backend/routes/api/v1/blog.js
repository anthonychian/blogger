const express = require('express');
const router = express.Router();
const Blog = require('../../../models/blog');
const Account = require('../../../models/account');
const verify = require('../../../middleware/verify');
const { check, validationResult } = require('express-validator'); 


// testing

router.get('/find', (req, res) => {
    Blog.find()
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
});

router.get('/myposts', verify.authenticateToken, async (req, res) => {
    try {
        //console.log(req.user.user.id)
        let account = await Account.findOne({ _id : req.user.user.id, isDelete: "false"})
        if (!account) {
            return res.status(400).json({
                message: 'Please login'
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

// create blog

// verify.authenticateToken,
router.post('/create', verify.authenticateToken, [
    check('header', 'Header limit cannot exceed 20 characters').not().isEmpty().isLength({ max: 20 }),
    check('content', 'Content limit cannot exceed 1000 characters').not().isEmpty().isLength({ max: 1000 }),
    ], 
    async (req, res) => { 
        try {
            let account = await Account.findOne({ _id : req.user.user.id, isDelete: "false"})
            if (!account) {
                return res.status(400).json({
                    message: 'Please login'
                });
            }
        
            // validation checks for all the input fields  
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }


            const {header, content} = req.body
            const userId = req.user.user.id
            // const userId = '5fc84d85d662615e21123c7a'
        
            var blog = new Blog({
                userId,
                header,
                content
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

// display all the blogs
// check if the blog has been delete
// check if the account has been deleted

// verify.authenticateToken,
router.get('/', verify.authenticateToken, async (req, res) => {
    try {
        let account = await Account.findOne({ _id : req.user.user.id, isDelete: "false"})
        if (!account) {
            return res.status(400).json({
                message: 'Please login'
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

// verify.authenticateToken, 
router.get('/:id', verify.authenticateToken, async (req, res) => {
    try {
        let account = await Account.findOne({ _id : req.user.user.id, isDelete:"false"})
        if (!account) {
            return res.status(400).json({
                message: 'Please login'
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

// update

// verify.authenticateToken, 
router.put('/:id', verify.authenticateToken, [
    check('header', 'Header limit cannot exceed 20 characters').not().isEmpty().isLength({ max: 20 }),
    check('content', 'Content limit cannot exceed 1000 characters').not().isEmpty().isLength({ max: 10 }),
    ], 
    async (req, res) => { 
        try {
            let account = await Account.findOne({ _id : req.user.user.id, isDelete:"false"})
            if (!account) {
                return res.status(400).json({
                    message: 'Please login'
                });
            }

            // validation checks for all the input fields  
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {header, content}  = req.body
            const date = new Date();

            // Blog.findOne({ _id : req.params.id, isDelete: false })
            // .then(
            //     (blog) => {
            //         if (blog == null) {
            //             return res.status(404).json({
            //                 message: 'No blog post found'
            //             });
            //         }
            //         Blog.updateOne(
            //             { _id : req.params.id , isDelete: false },
            //             {
            //                 content: content,
            //                 modifiedDate: date
            //             }
            //         )
            //         .then(
            //             () => {
            //                 return res.status(201).json({
            //                     message: 'Blog post updated ' + date
            //                 });
            //             }
            //         )
            //     }
            // ).catch(
            //     (error) => {
            //         return res.status(404).json({
            //             error: error
            //         });
            //     }
            // );
            Blog.findOneAndUpdate(
                { _id : req.params.id , isDelete: false },
                {
                    header,
                    content,
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
// delete

// verify.authenticateToken,
router.delete('/:id', verify.authenticateToken, async (req, res) => {
    try {
        let account = await Account.findOne({ _id : req.user.user.id, isDelete: "false"})
        if (!account) {
            return res.status(400).json({
                message: 'Please login'
            });
        }
        // Blog.findOne({ _id : req.params.id, isDelete: false })
        // .then(
        //     (blog) => {
        //         if (blog == null) {
        //             return res.status(404).json({
        //                 message: 'No blog post found'
        //             });
        //         }
        //         Blog.updateOne(
        //             { _id : req.params.id , isDelete: false },
        //             {
        //                 isDelete: true
        //             }
        //         )
        //         .then(
        //             () => {
        //                 return res.status(201).json({
        //                     message: 'Blog post deleted'
        //                 });
        //             }
        //         )
        //     }
        // ).catch(
        //     (error) => {
        //         return res.status(404).json({
        //             error: error
        //         });
        //     }
        // );
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

module.exports = router;