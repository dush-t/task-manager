const JoinRequest = require('../models/JoinRequest');


// Allow club members and fresher to view his joinRequest data.
// Allow mentor and fresher to delete/create joinRequests.
// Allow only the mentor to change any joinRequest.
const checkJoinReqPermission = async (req, res, next) => {
    const joinRequest = await JoinRequest.findOne({ _id: req.params.join_id });

    if (req.method === "GET") {
        if (req.user.clubs.includes(joinRequest.club) || req.user._id.equals(joinRequest.user)) {
            req.joinRequest = joinRequest;
            next();
        } else {
            return res.status(403).send({
                'error': 'You are not authorized to view this data'
            });
        }

    } else if (req.method === 'POST' || req.method === 'DELETE') {
        if (req.user._id.equals(joinRequest.mentor) || req.user._id.equals(joinRequest.user)) {
            req.joinRequest = joinRequest;
            console.log("joinRequest middleware check passed!")
            next();
        } else {
            return res.status(403).send({
                'error': 'You are not authorized to change this data lol'
            });
        }

    } else {
        if (req.user._id.equals(joinRequest.mentor)) {
            req.joinRequest = joinRequest;
            next();
        } else {
            return res.status(403).send({
                'error': 'You are not authorized to change this data'
            })
        }
    }
}

module.exports = checkJoinReqPermission;