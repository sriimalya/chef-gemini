import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { GoogleGenAI } from "@google/genai";

const app = express()
app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = 5000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/get-recipe', async (req, res) => {

  try {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "No ingredients provided." });
    }
    const prompt = `Suggest a creative recipe using only these ingredients: ${ingredients.join(
      ", "
    )}. Include clear steps and measurements in 5 steps.`; 
    
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    
    const text = response.text; 
    res.json({ recipe: text });
    
  } catch (error) {
    console.error("Gemini API error:", error.message || error);
    res.status(500).json({ error: "Failed to fetch recipe." });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});