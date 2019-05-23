const Club = require('../models/club');

const checkClubPermission = async (req, res, next) => {
    const club = await Club.findOne({ _id: req.params.club_id });
    if (!club) {
        return res.status(404).send({
            'error': 'The club you are looking for does not exist'
        });
    }
    if (req.user.clubs.includes({ club: club._id })) {
        req.club = club;
        next();
    } else {
        res.status(403).send({
            'error': "You do not have permission to view data for this club"
        });
    }
}

module.exports = checkClubPermission;