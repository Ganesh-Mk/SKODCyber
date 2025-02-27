// Import required dependencies (assuming Express)
const express = require('express');
const router = express.Router();
const Module = require('../models/moduleModel'); // Adjust path as needed for your model

router.get('/getSingleModule', async (req, res) => {
  try {
    const { moduleId } = req.query;

    // Validate moduleId
    if (!moduleId) {
      return res.status(400).json({ success: false, message: 'Module ID is required' });
    }

    // Find module by ID
    const module = await Module.findById(moduleId);

    // Check if module exists
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    // Return module data
    return res.status(200).json({
      success: true,
      module
    });
  } catch (error) {
    console.error('Error fetching single module:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error fetching module',
      error: error.message 
    });
  }
});

module.exports = router;
