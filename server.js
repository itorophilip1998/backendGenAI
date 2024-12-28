// backend/server.js
const express = require('express');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 8000;

// Enable CORS for all origins (You can restrict this to your frontend domain in production)
app.use(cors());
app.use(express.json());  // To parse JSON bodies

// Set up OpenAI instance
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // Generate text from OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });

        res.json({ generatedText: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating text' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
