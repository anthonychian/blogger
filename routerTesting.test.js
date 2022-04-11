const app = require('./app') // Link to your server file
const supertest = require('supertest')
const request = supertest(app);

const jwt = require('jsonwebtoken');
const SECRET = process.env.ACCESS_TOKEN_SECRET;
const TEST_POST_ID = process.env.TEST_POST_ID
const Account = require('./models/account');
const { BlogService } = require('./services/BlogService');
const blogService = new BlogService();

async function seedUser(userId) {
    
    const testingUser = new Account({
        username: "tesingUser",
        password: "123abc",
        email: "a@a.com",
        firstName: "ad",
        lastName: "kqmlkmsd"
    });
    return await testingUser.save();
}

async function getMockJWTToken(testingUserId) {
    const payload = {
        user: {
            id: testingUserId
        }
    }
    const accessToken = jwt.sign(payload, SECRET, {expiresIn: '1hr'})
    console.log(`accessToken:${accessToken}`);
}

describe('Testing endpoints', () => {

    let testingUser = null;
    let accessToken = '';
    let testingUserId = '';

    beforeAll(async () => {
       testingUser = await seedUser();
       testingUserId = testingUser._id.toString();
       accessToken = await getMockJWTToken(testingUserId);
    }, 30000)

    it('should get all blogs', async() => {
        const blogs = await blogService.getAllBlogs(testingUserId);
        expect(blogs.length).toBe(8);
    })

    it('should get all my posts', async() => {
        const posts = await blogService.getMyPosts(testingUserId);
        expect(posts.length).toBe(0);
    })

    it('should get a specific post', async() => {
        const post = await blogService.getPost(testingUserId, TEST_POST_ID);
        expect(post.header).toBe('Sky and Clouds');
    })

    it('should increment likes on a specific post', async() => {
        const post = await blogService.likePost(testingUserId, TEST_POST_ID);
        expect(post).toBe(2);
    })

    it('should decrement likes on a specific post', async() => {
        const post = await blogService.unlikePost(testingUserId, TEST_POST_ID);
        expect(post).toBe(1);
    })


})