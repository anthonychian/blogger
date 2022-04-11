const Account = require('../models/account');
const Blog = require('../models/blog');

class BlogService {
    constructor() {}

    async getAllBlogs(userId) {
        try {
            let account = await Account.findOne({ _id : userId, isDelete: "false"})
            if (!account) {
                return res.status(400).json({
                    login_error: 'Please login'
                });
            }
            const blogs = await Blog.find({ isDelete: 'false'});
            console.log('blogs', blogs);
            console.log('done');
            return blogs;
            // Blog.find({ isDelete: "false" })
            // .then((blog) => {
            //     return res.status(200).json(blog);
            // })
            // .catch((error) => {
            //     return res.status(404).json({
            //         error: error
            //     });
            // });
        }
        catch(error) {
            console.log('error', error.message);
            return null;
            // return status(500).send(error);
        }
    }

    async getMyPosts(userId) {
        try {
            //console.log(req.user.user.id)
            let account = await Account.findOne({ _id : userId, isDelete: "false"})
            if (!account) {
                return res.status(400).json({
                    login_error: 'Please login'
                });
            }
            const posts = await Blog.find({ userId : userId, isDelete: 'false'});
            console.log('posts', posts);
            console.log('done');
            return posts;
            // Blog.find({ userId : userId, isDelete: "false" })
            // .then((blog) => {
            //         return res.status(200).json(blog);
            // })
            // .catch((error) => {
            //     return res.status(404).json({
            //         error: error
            //     });
            // });
        }
        catch(error) {
            console.log('error', error.message);
            return null;
            //return res.status(500).send(error)
        }
    }

    async getPost(userId, postId) {
        try {
            let account = await Account.findOne({ _id : userId, isDelete:"false"})
            if (!account) {
                return res.status(400).json({
                    login_error: 'Please login'
                });
            }

            const post = await Blog.findOne({ _id : postId, isDelete: 'false'});
            console.log('posts', post);
            console.log('done');
            return post;

            // Blog.findOne({ _id : req.params.id, isDelete: false })
            // .then((blog) => {
            //     if (blog == null) {
            //         return res.status(404).json({
            //             message: 'No blog post found'
            //         });
            //     }
            //     return res.status(200).json(blog);
            // })
            // .catch((error) => {
            //     return res.status(404).json({
            //         error: error
            //     });
            // });
        }
        catch(error) {
            console.log('error', error.message);
            return null;
            // return res.status(500).send(error)
        }
    }
    async likePost(userId, postId) {
        try {
            let account = await Account.findOne({ _id : userId, isDelete:"false"})
            if (!account) {
                return res.status(400).json({
                    login_error: 'Please login'
                });
            }
            // find unliked blog post and like it

            const post = await Blog.findOneAndUpdate(
                { _id : postId, isDelete: false},
                {
                    $inc: {likes: 1},
                    $push: {usersWhoLiked: userId}
                }
            );
            console.log('liked', post.likes + 1);
            console.log('done');
            return post.likes + 1;

            // Blog.findOneAndUpdate(
            //     { _id : req.params.id , isDelete: false },
            //     {
            //         $inc: {likes: 1},
            //         $push: {usersWhoLiked: req.user.user.id}
            //     }
            // )
            // .then((data) => {
            //     return res.status(201).json(data.likes + 1)
            // })
            // .catch((error) => {
            //     return res.status(404).json({
            //         error: error
            //     });
            // });
        }
        catch(error) {
            console.log('error', error.message);
            return null;
            // return res.status(500).send(error)
        }
    }

    async unlikePost(userId, postId) {
        try {
            let account = await Account.findOne({ _id : userId, isDelete:"false"})
            if (!account) {
                return res.status(400).json({
                    login_error: 'Please login'
                });
            }
            // find liked blog post and unlike it

            const post = await Blog.findOneAndUpdate(
                { _id : postId, isDelete: false},
                {
                    $inc: {likes: -1},
                    $push: {usersWhoLiked: userId}
                }
            );
            console.log('unliked', post.likes - 1);
            console.log('done');
            return post.likes - 1;

            // Blog.findOneAndUpdate(
            //     { 
            //         _id : req.params.id, 
            //         isDelete: false, 
            //         usersWhoLiked: {
            //             $all:[req.user.user.id]
            //         }
            //     },
            //     {
            //         $inc: {likes: -1},
            //         $pull: {usersWhoLiked: req.user.user.id}
            //     }
            // )
            // .then((data) => {
            //     return res.status(201).json(data.likes - 1)
            // })
            // .catch((error) => {
            //     return res.status(404).json({
            //         error: error
            //     });
            // });
        }
        catch(error) {
            console.log('error', error.message);
            return null;
            // return res.status(500).send(error)
        }
    }
}

module.exports.BlogService = BlogService;