const Club = require('../models/club');


const checkClubPermission = async (req, res, next) => {
    const club = await Club.findOne({ _id: req.params.club_id });
    if (!club) {
        return res.status(404).send({
            'error': 'The club you are looking for does not exist'
        });
    }

    //I have a really bad feeling about this
    const isAllowed = req.user.clubs.some((club) => {
        return (club._id.toString() === req.params.club_id);
    })
    if (isAllowed) {
        req.club = club;
        console.log("Middleware check successful");
        next();
    } else {
        res.status(403).send({
            'error': "You do not have permission to view or edit data for this club"
        });
    }
}

module.exports = checkClubPermission;