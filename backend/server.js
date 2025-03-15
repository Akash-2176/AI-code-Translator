require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const API_URL = "https://api.deepinfra.com/v1/openai/chat/completions";

app.use(express.json());
app.use(cors());

app.post('/translate', async (req, res) => {
    const { code, sourceLang, targetLang } = req.body;

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
            .replace(/```.*?\n/g, "")
            .replace(/```/g, "")
            .trim();

        res.json({ translatedCode });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Translation failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
