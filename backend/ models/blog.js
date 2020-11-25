const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    id: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    upvotes: { type: String, required: true },
    viewCount: { type: String, required: true },
    modifiedDate: { type: Date, required: true },
    createdDate: { type: Date, required: true },
    isDelete: { type: Boolean, required: true },
});

module.exports = mongoose.model('Blog', blogSchema);