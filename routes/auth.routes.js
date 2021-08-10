const { Router } = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();

router.post(
    '/register',
    [
        check('password', 'Minimal length of password is 4').isLength({ min: 4 })
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect registration data'
            })
        } 
        const { login, password, admin } = req.body;

        const candidate = await User.findOne({ login });
        if (candidate) {
            return res.status(400).json({ message: 'User already exist' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ login: login, password: hashedPassword, admin });
        await user.save();
        res.status(201).json({ message: 'User created' })

    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});

router.post(
    '/login',
    [
        check('login', 'Enter correct login').exists(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect login data'
            })
        }
        const { login, password } = req.body;
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist'});
        } 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password'});
        }
        const token = jwt.sign(
            { userId: user.id, admin: user.admin },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )
        res.json({ token, userId: user.id, admin: user.admin });

    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again' });
    }
});

module.exports = router;