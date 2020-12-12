const mongoose = require('mongoose');
const dateNow = new Date();

const blogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    header: { type: String, required: true},
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0},
    viewCount: { type: Number, default: 0},
    modifiedDate: { type: Date, default: dateNow},
    createdDate: { type: Date, default: dateNow},
    isDelete: { type: Boolean, default: false},
});

module.exports = mongoose.model('Blog', blogSchema);