const JoinRequest = require('../models/JoinRequest');


// Allow club members and fresher to view his joinRequest data.
// Allow mentor and fresher to delete/create joinRequests.
// Allow only the mentor to change any joinRequest.
const checkJoinReqPermission = async (req, res, next) => {
    const joinRequest = JoinRequest.findById(req.params.join_id);

    if (req.method === "GET") {
        if (req.user.clubs.includes({ club: joinRequest.club }) || req.user._id === joinRequest.user) {
            next();
        } else {
            return res.status(403).send({
                'error': 'You are not authorized to view this data'
            });
        }

    } else if (req.method === 'POST' || req.method === 'DELETE') {
        if (req.user._id === joinRequest.mentor || req.user._id === joinRequest.user) {
            next();
        } else {
            return res.status(403).send({
                'error': 'You are not authorized to change this data'
            });
        }

    } else {
        if (req.user._id === joinRequest.mentor) {
            next();
        } else {
            return res.status(403).send({
                'error': 'You are not authorized to change this data'
            })
        }
    }
}

module.exports = checkJoinReqPermission;