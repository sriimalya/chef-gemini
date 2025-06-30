import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { GoogleGenAI } from "@google/genai";

const app = express()
app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 5000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/get-recipe', async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return res.status(400).json({ error: "No ingredients provided." });
    }

    const prompt = `Create a delicious recipe using these main ingredients: ${ingredients.join(
      ", "
    )}.

ASSUMPTIONS: You can assume the user has basic pantry staples like cooking oil, salt, black pepper, turmeric powder, red chili powder, cumin powder, coriander powder, garam masala, ginger-garlic paste, onions, and water. Please mention which of these staples you're using in your recipe.

REQUIREMENTS:
- Focus on Indian cuisine flavors and cooking techniques
- Mention if it's inspired from other cuisines too like Indian-Chinese, Italian, etc. in 1-2 lines.
- Provide exactly 5 clear, easy-to-follow steps
- Include precise measurements for all ingredients
- Mention cooking time and serving size
- Add tips for best results or variations if possible
- Format the response with clear headings: Recipe Name, Ingredients (mention the asumed ones separately in the same section), Instructions, Cooking Time, Serves, and Chef's Tip

Make the recipe authentic yet accessible for home cooking.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-preview-06-17",
      contents: prompt,
    });

    const text = response.text;
    res.json({ recipe: text });
  } catch (error) {
    console.error("Gemini API error:", error.message || error);
    res.status(500).json({ error: "Failed to fetch recipe." });
  }
});

app.listen(PORT);
