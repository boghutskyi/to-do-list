const { Router } = require('express');
const config = require('config');
const router = Router();
const auth = require('../middleware/auth.middleware');
const Task = require('../models/Task');

router.post('/add', auth, async (req, res) => {
    try {
        const task = new Task({
            description: req.body.description,
            owner: req.user.userId
        })

        await task.save();
        res.status(201).json({ message: 'Created' });
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        if (req.user.admin) {
            const allTasks = await Task.find();
            return res.json(allTasks)
        }
        const tasks = await Task.find({ owner: req.user.userId });
        res.json(tasks);
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});

router.patch('/', auth, async (req, res) => {
    try {
        await Task.updateOne({ _id: req.body._id },  {done: !req.body.done});
        res.status(201).json({ message: 'Updated' });
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});

router.delete('/', auth, async (req, res) => {
    try {
        await Task.deleteOne({ _id: req.body._id });
        res.status(201).json({ message: 'Deleted' });
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});

module.exports = router;