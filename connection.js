const mongoose = require('mongoose');

exports.db = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connection established from MongoDB');
    }).catch((err) => {
        console.log(err);
    })
};