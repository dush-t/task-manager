const Task = require('../models/task');
const JoinRequest = require('../models/JoinRequest');

const checkTaskPermission = async (req, res, next) => {
    const task = Task.findById(req.params.task_id);
    await task.populate('relatedRequest').execPopulate();
    const relatedRequest = task.relatedRequest;
    // await relatedRequest.populate('club').execPopulate();
    // await relatedRequest.populate('user').execPopulate();
    // await relatedRequest.populate('mentor').execPopulate();

    if (req.method === 'GET') {

        if (req.user.clubs.includes({ club: relatedRequest.club }) || req.user._id === relatedRequest.user) {
            req.joinRequest = relatedRequest;
            next();
        } else {
            res.status(403).send({
                'errorLocation': 'middleware: task-permission',
                'error': 'Dafuq are you trying to do'
            });
        }
    } else if (req.method === 'POST' || req.method === 'PATCH') {

        if (relatedRequest.mentor === req.user._id) {
            req.joinRequest = relatedRequest;
            next();
        } else {
            res.status(403).send({
                'error': 'You do not have permission to change this task'
            });
        }
    }

}

module.exports = checkTaskPermission;