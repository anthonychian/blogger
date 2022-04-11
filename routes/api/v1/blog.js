require('dotenv').config();
const express = require('express');
const router = express.Router();
const Blog = require('../../../models/blog');
const Account = require('../../../models/account');
const verify = require('../../../middleware/verify');
const { check, validationResult } = require('express-validator'); 
const { BlogService } = require('../../../services/BlogService');
const blogClass = new BlogService();

const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

router.get('/getUploadInfo', (req, res) => { 
    let info = {
        cloudUrl: process.env.CLOUD_URL,
        uploadPreset: process.env.UPLOAD_PRESET
    }
    return res.status(200).json(info);
});

// display only users posts
router.get('/myposts', verify.authenticateToken, async (req, res) => {
    const userId = req.user.user.id;
    const posts = await blogClass.getMyPosts(userId);

    if (!posts) {
        return status(500).send("Internal Server Error");
    }

    return posts;
    // try {
    //     //console.log(req.user.user.id)
    //     let account = await Account.findOne({ _id : req.user.user.id, isDelete: "false"})
    //     if (!account) {
    //         return res.status(400).json({
    //             login_error: 'Please login'
    //         });
    //     }
    //     Blog.find({ userId : req.user.user.id, isDelete: "false" })
    //     .then(
    //         (blog) => {
    //             return res.status(200).json(blog);
    //         }
    //     ).catch(
    //         (error) => {
    //             return res.status(404).json({
    //                 error: error
    //             });
    //         }
    //     );
    // }
    // catch(error) {
    //     return res.status(500).send(error)
    // }
});
// return current user id
router.get('/myid', verify.authenticateToken, async (req, res) => {
    
    return res.status(200).json(req.user.user.id);
});

// return list of all blogs
router.get('/', verify.authenticateToken, async (req, res) => {
    const userId = req.user.user.id;
    const blogs = await blogClass.getAllBlogs(userId);

    if (!blogs) {
        return status(500).send("Internal Server Error");
    }

    return blogs;
    
    // try {
    //     let account = await Account.findOne({ _id : req.user.user.id, isDelete: "false"})
    //     if (!account) {
    //         return res.status(400).json({
    //             login_error: 'Please login'
    //         });
    //     }
    //     Blog.find({ isDelete: "false" })
    //     .then(
    //         (blog) => {
    //             return res.status(200).json(blog);
    //         }
    //     ).catch(
    //         (error) => {
    //             return res.status(404).json({
    //                 error: error
    //             });
    //         }
    //     );
    // }
    // catch(error) {
    //     return status(500).send(error)
    // }
});

// get a specific blog (_id in mongodb)
router.get('/:id', verify.authenticateToken, async (req, res) => {
    const userId = req.user.user.id;
    const postId = req.params.id;
    const post = await blogClass.getPost(userId, postId);

    if (!post) {
        return status(500).send("Internal Server Error");
    }

    return post;

    // try {
    //     let account = await Account.findOne({ _id : req.user.user.id, isDelete:"false"})
    //     if (!account) {
    //         return res.status(400).json({
    //             login_error: 'Please login'
    //         });
    //     }
    //     Blog.findOne({ _id : req.params.id, isDelete: false })
    //     .then(
    //         (blog) => {
    //             if (blog == null) {
    //                 return res.status(404).json({
    //                     message: 'No blog post found'
    //                 });
    //             }
    //             return res.status(200).json(blog);
    //         }
    //     ).catch(
    //         (error) => {
    //             return res.status(404).json({
    //                 error: error
    //             });
    //         }
    //     );
    // }
    // catch(error) {
    //     return res.status(500).send(error)
    // }
});


router.post('/deleteImg', async (req, res) => { 
    try {
        const {public_id} = req.body

        cloudinary.v2.uploader.destroy(public_id, function(error,result) {
            console.log(result, error) 
        });
    }
    catch(error) {
        console.log(130, error)
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
        .isURL().withMessage('Invalid file'),
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
            const {header, content, coverImgUrl, dateNow} = req.body
            // let {headerInput, contentInput} = req.body

            // // sanitize body
            // const header = req.sanitize(headerInput)
            // const content =req.sanitize(contentInput)

        
            var blog = new Blog({
                userId,
                header,
                content,
                coverImgUrl,
                createdDate: dateNow,
                modifiedDate: dateNow,
            });

            await blog.save()
            .then(
                () => {
                    return res.status(201).json({
                        message: 'Blog post created ' + dateNow
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

            //const dateNow = new Date();
            const {header, content, coverImgUrl, dateNow} = req.body

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
                    modifiedDate: dateNow
                }
            )
            .then(() => {
                console.log(261, dateNow)
                return res.status(201).json({
                    message: 'Blog post updated ' + dateNow
                });
            })
            .catch((error) => {
                return res.status(404).json({
                    error: error
                });
            });
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
    const userId = req.user.user.id;
    const postId = req.params.id;
    const likes = await blogClass.likePost(userId, postId);

    if (!likes) {
        return status(500).send("Internal Server Error");
    }

    return likes;
    
    // try {
    //     let account = await Account.findOne({ _id : req.user.user.id, isDelete:"false"})
    //     if (!account) {
    //         return res.status(400).json({
    //             login_error: 'Please login'
    //         });
    //     }
    //     // find unliked blog post and like it
    //     Blog.findOneAndUpdate(
    //         { _id : req.params.id , isDelete: false },
    //         {
    //             $inc: {likes: 1},
    //             $push: {usersWhoLiked: req.user.user.id}
    //         }
    //     )
    //     .then(
    //         (data) => {
    //             return res.status(201).json(data.likes + 1)
    //         }
    //     ).catch(
    //         (error) => {
    //             return res.status(404).json({
    //                 error: error
    //             });
    //         }
    //     );
    // }
    // catch(error) {
    //     return res.status(500).send(error)
    // }
});
// unlike post
router.put('/:id/unlike', verify.authenticateToken, async (req, res) => { 
    const userId = req.user.user.id;
    const postId = req.params.id;
    const likes = await blogClass.unlikePost(userId, postId);

    if (!likes) {
        return status(500).send("Internal Server Error");
    }

    return likes;
    
    // try {
    //     let account = await Account.findOne({ _id : req.user.user.id, isDelete:"false"})
    //     if (!account) {
    //         return res.status(400).json({
    //             login_error: 'Please login'
    //         });
    //     }

    //     // find liked blog post and unlike it
    //     Blog.findOneAndUpdate(
    //         { _id : req.params.id , isDelete: false, usersWhoLiked: {$all:[req.user.user.id]} },
    //         {
    //             $inc: {likes: -1},
    //             $pull: {usersWhoLiked: req.user.user.id}
    //         }
    //     )
    //     .then((data) => {
    //         return res.status(201).json(data.likes - 1)
    //     })
    //     .catch((error) => {
    //         return res.status(404).json({
    //             error: error
    //         });
    //     });
    // }
    // catch(error) {
    //     return res.status(500).send(error)
    // }
})

// router.post('/uploadImg', async (req, res) => { 
//     try {
//         if (req.files) {
//             var file = req.files.img
            
//             // cloudinary.v2.uploader.upload(file, function(error, result) {
//             //     console.log(result, error); 
//             // });
//         }
//     }
//     catch(error) {
//         console.log(130, error)
//         return res.status(500).send(error)
//     }
// });

module.exports = router;