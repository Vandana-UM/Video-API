// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const Video = require('../models/videoModel');

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add new video
router.post('/', async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;
    if (!title || !videoUrl) {
      return res.status(400).json({ success: false, message: 'title and videoUrl are required' });
    }
    const newVideo = new Video({ title, description, videoUrl });
    const saved = await newVideo.save();
    res.status(201).json({ success: true, message: 'Video added successfully!', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update a video by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, videoUrl } = req.body;

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { title, description, videoUrl },
      { new: true, runValidators: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.json({ success: true, message: 'Video updated successfully', data: updatedVideo });
  } catch (err) {
    console.error('PUT error:', err); // 👈 add this line
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete a video by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (err) {
    console.error('DELETE error:', err); // 👈 add this line
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
