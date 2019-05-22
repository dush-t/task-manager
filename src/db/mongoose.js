const mongoose = require('mongoose');
const config = require('../../config/config.js') || undefined;

mongoose.connect(process.env.MONGODB_URL || config.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
