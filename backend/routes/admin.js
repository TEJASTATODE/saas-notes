const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const User = require('../models/users');
const { requireAuth, requireRole } = require('../middleware/auth');

// Upgrade tenant to Pro
router.post('/tenants/:slug/upgrade', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { slug } = req.params;
        const tenant = await Tenant.findOne({ slug });
        if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

        tenant.plan = 'pro';
        tenant.noteLimit = 0;
        await tenant.save();

        res.json({ message: 'Tenant upgraded to Pro', tenant });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// List users for tenant
router.get('/users', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { tenantId } = req.user;
        const users = await User.find({ tenantId }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Invite user
router.post('/users/invite', requireAuth, requireRole('admin'), async (req, res) => {
    try {
        const { tenantId } = req.user;
        const { email, role } = req.body;
        if (!email || !role) return res.status(400).json({ message: 'Email and role required' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({
            email,
            password: 'password', // default
            role,
            tenantId
        });

        await newUser.save();
        res.status(201).json({ message: 'User invited', user: { email, role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
