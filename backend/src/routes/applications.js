const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const axios = require('axios');
const authMiddleware = require('../middleware/auth');

router.post('/apply', authMiddleware('student'), async (req, res) => {
  const { campaignId, documents } = req.body;
  const studentId = req.user.id;

  const { data } = await axios.post('http://ml_service:8000/predict', {
    gpa: req.user.profile.gpa,
    income: req.user.profile.income
  });

  const application = new Application({
    studentId,
    campaignId,
    mlPrediction: data.eligibility,
    documents
  });

  await application.save();
  res.status(201).json(application);
});

router.get('/', authMiddleware(['admin', 'institution']), async (req, res) => {
  const applications = await Application.find().populate('studentId', 'walletAddress profile');
  res.json(applications);
});

module.exports = router;