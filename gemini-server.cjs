const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = 'AIzaSyDu993T6jryAOONM6yQmO947uNA_bIqvlE';

const SYSTEM_PROMPT = "You are a helpful assistant for the DineReserve website. Only answer questions related to restaurant reservations, dining, and the features of DineReserve. If a user asks something unrelated, politely tell them you can only help with DineReserve topics. If a user asks to book a table or find a restaurant, extract the cuisine, city, date, time, and party size from their request, and return a list of matching available restaurants.";

// Import mock data
const mockDataPath = path.join(__dirname, 'src', 'utils', 'mockData.ts');
let mockRestaurants = [];
try {
  // Use require for .js, for .ts you may need to transpile or use a static copy
  mockRestaurants = require('./src/utils/mockData.js').mockRestaurants;
} catch (e) {
  // fallback: empty array
  mockRestaurants = [];
}

// Simple parser for extracting filters from user input
function extractFilters(text) {
  const cuisineMatch = text.match(/(indian|japanese|mexican|american|california)/i);
  const cityMatch = text.match(/in ([a-zA-Z ]+)/i);
  const dateMatch = text.match(/tomorrow|today|\d{4}-\d{2}-\d{2}/i);
  const timeMatch = text.match(/(\d{1,2}:\d{2}|\d{1,2} ?(am|pm))/i);
  const partyMatch = text.match(/table for (\d+)/i);
  return {
    cuisine: cuisineMatch ? cuisineMatch[1] : null,
    city: cityMatch ? cityMatch[1].trim() : null,
    date: dateMatch ? dateMatch[0] : null,
    time: timeMatch ? timeMatch[0] : null,
    partySize: partyMatch ? parseInt(partyMatch[1]) : null,
  };
}

app.post('/api/llm', async (req, res) => {
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1]?.content || '';
  const filters = extractFilters(userMessage);

  // Check if user mentioned a restaurant by name
  let restaurants = mockRestaurants.length ? mockRestaurants : [
    { id: '1', name: 'Fog City Diner', cuisine: 'American', address: { city: 'San Francisco' } },
    { id: '2', name: 'Sushi Ran', cuisine: 'Japanese', address: { city: 'Sausalito' } },
    { id: '3', name: 'Chez Panisse', cuisine: 'California', address: { city: 'Berkeley' } },
    { id: '4', name: 'Tacolicious', cuisine: 'Mexican', address: { city: 'San Francisco' } },
  ];
  const mentioned = restaurants.find(r => userMessage.toLowerCase().includes(r.name.toLowerCase()));
  if (mentioned) {
    // Return a special response with the restaurant's ID and name
    return res.json({
      candidates: [{
        content: {
          parts: [{
            text: `Would you like to view more about ${mentioned.name}?`,
            restaurant: { id: mentioned.id, name: mentioned.name }
          }]
        }
      }]
    });
  }

  // If it's a booking/search request, filter and return restaurants
  if (filters.cuisine || filters.city || filters.date || filters.time || filters.partySize) {
    // Fallback to a static mock if require fails
    let filtered = restaurants.filter(r => {
      let match = true;
      if (filters.cuisine) match = match && r.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase());
      if (filters.city) match = match && r.address.city.toLowerCase().includes(filters.city.toLowerCase());
      return match;
    });
    // Format response
    const responseText = filtered.length
      ? `Here are some available restaurants${filters.city ? ' in ' + filters.city : ''}${filters.cuisine ? ' serving ' + filters.cuisine + ' cuisine' : ''}:
` + filtered.map(r => `- ${r.name} (${r.cuisine}, ${r.address.city})`).join('\n')
      : 'Sorry, no restaurants match your criteria.';
    return res.json({ candidates: [{ content: { parts: [{ text: responseText }] } }] });
  }

  // Otherwise, use Gemini LLM
  try {
    const allMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: allMessages.map(m => m.content).join('\n') }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 64
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from Gemini API' });
  }
});

app.get('/api/gemini-models', async (req, res) => {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Gemini proxy server running on port ${PORT}`);
}); 