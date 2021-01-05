const mongoose = require('mongoose');
require('dotenv').config()

module.exports = {
    connectMongoDB: function() {
        mongoose.connect(process.env.MONGOURL,
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