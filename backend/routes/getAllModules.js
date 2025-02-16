const express = require('express');
const router = express.Router();
const Module = require('../models/moduleModel');

router.get('/allModules', async (req, res) => {

  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;