const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
    },
    logo: {
        type: Buffer
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

clubSchema.virtual('members', {
    ref: 'User',
    localField: '_id',
    foreignField: 'club'
})

clubSchema.virtual('joinRequests', {
    ref: 'JoinRequest',
    localfield: '_id',
    foreignField: 'club'
})

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;