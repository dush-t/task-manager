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
    await this.populate('user').execPopulate();
    const user = this.user;
    const club = this.club;
    user.clubs.push(club);
    await user.save();
}

joinRequestSchema.pre('save', async function (next) {
    const joinRequest = await JoinRequest.findOne({
        user: this.user,
        club: this.club
    })
    if (!joinRequest) {
        next();
    } else {
        throw new Error('A join request for this user in this club is already created.');
    }
})

const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema);

module.exports = JoinRequest;