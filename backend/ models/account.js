const mongoose = require('mongoose');
const dateNow = new Date().getUTCDate();

const accountSchema = new mongoose.Schema({
    username: { type: String, required: true},
    password: { type: String, required: true },
    email: { type: String, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    imgUrl: { type: String, required: true },
    modifiedDate: { type: Date, default: dateNow},
    createdDate: { type: Date, default: dateNow},
    isDelete: { type: Boolean, default: false},
});

module.exports = mongoose.model('Account', accountSchema);
