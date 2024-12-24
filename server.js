require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const OpenAI = require('openai');

const app = express();
// Use environment port or default to 3000
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// In-memory storage for mood entries
const moodEntries = [];

// Middleware
app.use(bodyParser.json());
app.use(express.static('static'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, mood } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Received message:', message, 'Current mood:', mood); // Debug log

        const systemPrompt = `You are a compassionate and understanding mental health companion named Mindful AI.
        The user's current mood is: ${mood || 'unknown'}. 
        Your role is to:
        1. Provide supportive, empathetic responses
        2. Help users process their thoughts and feelings
        3. Suggest practical coping strategies when appropriate
        4. Maintain a warm and friendly tone
        Never provide medical advice or diagnoses. Keep responses concise and focused.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            max_tokens: 200,
            temperature: 0.7,
            presence_penalty: 0.6
        });

        const aiResponse = completion.choices[0].message.content.trim();
        console.log('AI Response:', aiResponse); // Debug log

        res.json({ 
            response: aiResponse,
            success: true 
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        const errorMessage = error.response?.data?.error?.message || error.message;
        res.status(500).json({ 
            error: 'Failed to get AI response',
            details: errorMessage
        });
    }
});

// API endpoints for mood tracking
app.post('/api/mood', (req, res) => {
    try {
        const { mood, note, timestamp } = req.body;
        
        if (!mood) {
            return res.status(400).json({ error: 'Mood is required' });
        }

        const entry = {
            id: Date.now(),
            mood,
            note,
            timestamp: timestamp || new Date().toISOString()
        };

        moodEntries.unshift(entry);
        res.status(201).json({ success: true, entry });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save mood entry' });
    }
});

app.get('/api/moods', (req, res) => {
    try {
        res.json(moodEntries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve mood entries' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
