const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    imgUrl: { type: String, required: true },
    modifiedDate: { type: Date, required: true },
    createdDate: { type: Date, required: true },
    isDelete: { type: Boolean, required: true },
});

module.exports = mongoose.model('Account', accountSchema);
