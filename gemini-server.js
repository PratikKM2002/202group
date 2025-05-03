const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = 'AIzaSyDu993T6jryAOONM6yQmO947uNA_bIqvlE';

app.post('/api/llm', async (req, res) => {
  const { messages } = req.body;
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: messages.map(m => m.content).join('\n') }]
          }
        ]
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from Gemini' });
  }
});

app.listen(4001, () => console.log('LLM proxy server running on port 4001')); 