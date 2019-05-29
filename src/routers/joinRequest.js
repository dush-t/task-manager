const express = require('express');
const JoinRequest = require('../models/JoinRequest');
const User = require('../models/user');
const auth = require('../middleware/auth');
const {level2Check, level1Check} = require('../middleware/level');
const checkJoinReqPermission = require('../middleware/joinRequest-permission');
const checkClubPermission = require('../middleware/club-permission');

const router = new express.Router();


// REQUEST_TO_JOIN_CLUB
// can only be made by second-yearites.
router.post('/api/join_request/club/:club_id', auth, level2Check, checkClubPermission, async (req, res) => {
    const club = req.club;
    if (!club) {
        return res.status(404).send({'error': 'This club does not exist'});
    }

    if (!req.body.addJunior) {
        var user = req.user;        // using var here because this variable will
        var mentor = club.mentor;    // be used outside the if-else block
    } else {                        
        var user = await User.findOne({bits_id: req.body.bits_id});
        if (!user) {
            return res.status(404).send({
                'error': 'No junior with this id exists'
            });
        }
        var mentor = req.user._id;
    }

    const joinRequest = new JoinRequest({
        club: club._id,
        user: user._id,
        level: user.level,
        mentor: mentor
    });

    try {
        await joinRequest.save();
        res.status(201).send({'message': 'Your request to join this club has been sent to the club-mentor'});
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
})


//APPROVE_JOIN_REQUEST
router.post('/api/join_request/:join_id/approve', auth, level2Check, async (req, res) => {
    const _id = req.params.join_id;
    const joinRequest = await JoinRequest.findById(_id);
    await joinRequest.populate('club').execPopulate();

    if (joinRequest.level === 2) {
        if (!req.user._id.equals(joinRequest.club.mentor)) {
            return res.status(403).send({
                'error': 'You do not have the authority to add this member to the club'
            });
        }
    } else if (joinRequest.level === 1) {
        if (!req.user._id.equals(joinRequest.mentor)) {
            return res.status(403).send({
                'error': 'You do not have the authority to add this member to the club'
            });
        }
    } else {
        return res.status(500).send();
    }
  
    try {
        joinRequest.approve();
        await JoinRequest.findOneAndDelete({ _id: _id });
        res.send({'message': 'joinRequest successfully approved'});
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
})


// LIST_ALL_JOINREQUESTS_OF_CLUB
router.get('/api/join_request/:club_id/all', auth, checkClubPermission, async (req, res) => {
    try {
        const club = req.club;
        await club.populate({
            path: 'joinRequests',
            match: {
                level: parseInt(req.query.level)
            }
        }).execPopulate();
        res.send(club.joinRequests);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
})



// DELETE_JOINREQUEST_BY_ID
router.delete('/api/join_request/:join_id', auth, checkJoinReqPermission, async (req, res) => {
    try {
        const _id = req.params.join_id;
        await JoinRequest.findOneAndDelete({ _id: _id });
        res.send({
            message: 'joinRequest successfully deleted'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
})


module.exports = router;