const express = require('express');
const JoinRequest = require('../models/JoinRequest');
const auth = require('../middleware/auth');
const {level2Check, level1Check} = require('../middleware/level');
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
        req.user.clubs.push({club: club});
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

module.exports = router;