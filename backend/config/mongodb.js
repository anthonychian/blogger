const url = require('./mongoURL');
const mongoose = require('mongoose');
module.exports = {
    connectMongoDB: function() {
        mongoose.connect(url.MONGOURL,
        { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
            .then(() => {
                console.log('Successfully connected to MongoDB Atlas!');
            })
            .catch((error) => {
                console.log('Unable to connect to MongoDB Atlas!');
                console.error(error);
            });
    }
};