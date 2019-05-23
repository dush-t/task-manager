const mongoose = require('mongoose');
try {
    const config = require('../../config/config.js');
} catch (e) {
    console.log(e);
}


mongoose.connect(process.env.MONGODB_URL || config.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});
