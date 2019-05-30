const express = require('express');
const Task = require('../models/task');
const JoinRequest = require('../models/JoinRequest');
const auth = require('../middleware/auth');
const {level2Check, level1Check} = require('../middleware/level');
const checkJoinReqPermission = require('../middleware/joinRequest-permission');
const checkTaskPermission = require('../middleware/task-permission');
const router = new express.Router();




// CREATE_TASK
router.post('/api/:join_id/tasks', auth, level2Check, checkJoinReqPermission, async (req, res) => {
    
    const task = new Task({
        ...req.body,
        relatedRequest: req.joinRequest._id
    })
    
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})




// GET tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc

// VIEW_TASKS_By_JoinRequest_ID
router.get('/api/tasks/:join_id', auth, checkJoinReqPermission, async (req, res) => {
    const match = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    const sort = {};
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    
    const joinRequest = JoinRequest.findById(req.params.join_id);

    try {
        // const tasks = await Task.find({owner: req.user._id});
        joinRequest.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        }).execPopulate();
        res.send(joinRequest.tasks);

    } catch (e) {
        res.status(500).send();
    }
})




// VIEW_TASK_BY_ID
router.get('/api/tasks/:task_id', auth, checkTaskPermission, async (req, res) => {
    const _id = req.params.task_id;   
    try {
        //const task = await Task.findById(_id);
        const task = await Task.findOne({ _id: _id, relatedRequest: req.joinRequest._id });
        if (!task) {
            return res.status(404).send();
        }

        res.send(task);

    } catch (e) {
        res.status(500).send();
    }
})




// EDIT_TASK
router.patch('/api/tasks/:task_id', auth, level2Check, checkTaskPermission, async (req, res) => {
    const allowedUpdates = ['description', 'completed'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if (!isValidOperation) {
        return res.status(400).send({'error': 'Invalid updates!'});
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        const task = await Task.findOne({ _id: req.params.id, relatedRequest: req.joinRequest._id });
        
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        });
        
         await task.save();
        res.send(task);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
})




// DELETE_TASK
router.delete('/api/tasks/:task_id', auth, level2Check, checkTaskPermission, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({ _id: req.params.id, relatedRequest: req.joinRequest._id });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;