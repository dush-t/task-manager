const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,

    },
    completed: {
        type: Boolean,
        default: false
    },
    relatedRequest: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'JoinRequest'
    }
},{
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;