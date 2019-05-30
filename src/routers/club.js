const express = require('express');
const JoinRequest = require('../models/JoinRequest');
const auth = require('../middleware/auth');
const {level2Check, level1Check} = require('../middleware/level');
const checkClubPermission = require('../middleware/club-permission');
const multer = require('multer');
const sharp = require('sharp');
const Club = require('../models/club');
const User = require('../models/user');

const router = new express.Router();




// CREATE_CLUB
router.post('/api/clubs', auth, async (req, res) => {
    try {
        const club = new Club();                    // User who creates club is club-mentor
        club.name = req.body.name;
        club.mentor = req.user._id;
        await club.save();
        req.user.clubs.push(club);
        await req.user.save();
        res.status(201).send(club);
    } catch (e) {
        console.log(e);
        res.status(500).send(
            {"error": "An error occured. Please try again"}
        )
    }
})



// LIST_ALL_CLUBS
router.get('/api/clubs/all', async (req, res) => {
    try {
        const clubs = await Club.find({});
        res.send(clubs);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});



// LIST_USER_CLUBS
router.get('/api/clubs/me', auth, async (req, res) => {
    try {
        await req.user.populate('clubs.club').execPopulate();
        res.send(req.user.clubs);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});



// UPLOAD_CLUB_LOGO
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please provide jpg, jpeg or png file'));
        }
        cb(undefined, true);
    }
});
router.post('/api/clubs/:club_id/logo', auth, checkClubPermission, upload.single('logo'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 80, height: 80 }).png().toBuffer();
    if (req.club.mentor.equals(req.user._id)) {
        req.club.logo = buffer;
        await req.club.save();
        res.send();
    } else {
        res.status(403).send({
            error: 'You do not have the authority to change the club logo'
        })
    }
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
});



// VIEW_CLUB_LOGO
router.get('/club/:club_id/logo.png', async (req, res) => {
    try {
        const club = await Club.findById(req.params.club_id);
        if (!club || !club.logo) {
            return res.status(404).send();
        }
        res.set('Content-Type', 'image/png');
        res.send(club.logo);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }

})


module.exports = router;