const express = require('express');
const router = express.Router();
const axios = require('axios');
const History = require('../models/History');
const jwt = require('jsonwebtoken');

const API_URL = "https://api.deepinfra.com/v1/openai/chat/completions";
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token using the secret
    req.userId = decoded.userId;  // Save userId from token
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Translation API
router.post('/translate', authMiddleware, async (req, res) => {
  const { code, sourceLang, targetLang } = req.body;

  // Validate required fields
  if (!code || !sourceLang || !targetLang) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const data = {
    model: "Phind/Phind-CodeLlama-34B-v2",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: `Translate this ${sourceLang} code to ${targetLang}:\n\n${code}` }
    ],
    max_tokens: 300
  };

  try {
    const response = await axios.post(API_URL, data, {
      headers: { "Authorization": `Bearer ${process.env.API_KEY}` }
    });

    const translatedCode = response.data.choices[0].message.content
      .replace(/```.*?\n/g, "")  // Remove markdown code block formatting
      .replace(/```/g, "")  // Remove closing backticks
      .trim();

    // Save the chat history in a conversation-like structure (user and assistant messages)
    const history = new History({
      userId: req.userId,
      messages: [
        { role: 'user', message: code },
        { role: 'assistant', message: translatedCode }
      ]
    });
    await history.save();

    res.json({ translatedCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Translation failed" });
  }
});

// Get history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await History.find({ userId: req.userId }).sort({ timestamp: -1 });
    res.json({ history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
