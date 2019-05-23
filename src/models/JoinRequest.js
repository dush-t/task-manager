const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    level: {
        type: Number,
        required: true
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

joinRequestSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'relatedRequest'
});

joinRequestSchema.methods.approve = async function() {
    const user = this.user;
    const club = this.club;
    user.clubs = user.clubs.concat({ club: club });
    await user.save();
}

const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema);

module.exports = JoinRequest;