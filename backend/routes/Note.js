const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Tenant = require('../models/Tenant');
const { requireAuth } = require('../middleware/auth');

// Create note
router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const { tenantId, _id: userId } = req.user;

        if (!title) return res.status(400).json({ message: 'Title required' });

        const tenant = await Tenant.findById(tenantId);
        if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

        if (tenant.plan === 'free') {
            const noteCount = await Note.countDocuments({ tenantId });
            if (noteCount >= tenant.noteLimit) {
                return res.status(403).json({ message: 'Free plan limit reached. Upgrade to Pro.' });
            }
        }

        const note = new Note({ title, content, tenantId, createdBy: userId });
        await note.save();
        res.status(201).json(note);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all notes
router.get('/', requireAuth, async (req, res) => {
    try {
        const { tenantId } = req.user;
        const notes = await Note.find({ tenantId });
        const tenant = await Tenant.findById(tenantId);
        res.json({ notes, tenant });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get note by id
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const { tenantId } = req.user;
        const note = await Note.findOne({ _id: req.params.id, tenantId });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update note
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { tenantId } = req.user;
        const { title, content } = req.body;

        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, tenantId },
            { title, content },
            { new: true }
        );

        if (!note) return res.status(404).json({ message: 'Note not found or access denied' });
        res.json(note);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete note
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { tenantId } = req.user;
        const note = await Note.findOneAndDelete({ _id: req.params.id, tenantId });
        if (!note) return res.status(404).json({ message: 'Note not found or access denied' });
        res.json({ message: 'Note deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
