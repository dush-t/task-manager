const Task = require('../models/task');
const JoinRequest = require('../models/JoinRequest');

const checkTaskPermission = async (req, res, next) => {
    const task = await Task.findOne({ _id: req.params.task_id });
    if (!task) {
        return res.status(404).send();
    }
    await task.populate('relatedRequest').execPopulate();
    const relatedRequest = task.relatedRequest;

    if (req.method === 'GET') {
        // Allow user to view task if user is in the club related to the task or if the task is assigned to the user.
        const isAllowed = req.user.clubs.some((club) => {
            return (club._id.equals(relatedRequest.club));
        }) || req.user._id.equals(relatedRequest.user);

        if (isAllowed) {
            req.joinRequest = relatedRequest;
            req.task = task;
            next();
        } else {
            res.status(403).send({
                'errorLocation': 'middleware: task-permission',
                'error': 'Dafuq are you trying to do'
            });
        }
    } else if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'DELETE') {

        if (relatedRequest.mentor.equals(req.user._id)) {
            req.joinRequest = relatedRequest;
            req.task = task;
            console.log("task-permission middleware passed!")
            next();
        } else {
            res.status(403).send({
                'error': 'You do not have permission to change this task'
            });
        }
    }

}

module.exports = checkTaskPermission;