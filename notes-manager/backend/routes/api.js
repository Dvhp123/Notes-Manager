const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Activity = require('../models/Activity');

// --- AUTHENTICATION ---
// Simple Admin Login (Hardcoded for now)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// --- NOTES OPERATIONS ---

// 1. Get all notes
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes: ' + err.message });
  }
});

// 2. Add a new note (and log it)
router.post('/notes', async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content
  });

  try {
    const savedNote = await note.save();

    // Replicate/Log to Activity collection
    const activity = new Activity({
      actionType: 'Note Created',
      noteTitle: savedNote.title
    });
    await activity.save();

    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create note: ' + err.message });
  }
});

// 3. Update an existing note (and log it)
router.put('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    const updatedNote = await note.save();

    // Log the update
    const activity = new Activity({
      actionType: 'Note Updated',
      noteTitle: updatedNote.title
    });
    await activity.save();

    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update note: ' + err.message });
  }
});

// 4. Delete a note (and log it)
router.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const title = note.title;
    await Note.findByIdAndDelete(req.params.id);

    // Log the deletion
    const activity = new Activity({
      actionType: 'Note Deleted',
      noteTitle: title
    });
    await activity.save();

    res.json({ message: 'Note successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete note: ' + err.message });
  }
});

// --- ACTIVITY LOGS ---

// 5. Get all activity history
router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch activity logs: ' + err.message });
  }
});

module.exports = router;