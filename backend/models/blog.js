const mongoose = require('mongoose');
const dateNow = new Date().getUTCDate();

const blogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    content: { type: String, required: true },
    upvotes: { type: String, required: true },
    viewCount: { type: String, required: true },
    modifiedDate: { type: Date, default: dateNow, required: true },
    createdDate: { type: Date, default: dateNow, required: true },
    isDelete: { type: Boolean, default: false, required: true },
});

module.exports = mongoose.model('Blog', blogSchema);