import { GoogleGenAI } from "@google/genai";
import Recipe from "../models/Recipe.js";
import generatePrompt from '../utils/prompt.js'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return res.status(400).json({ error: "No ingredients provided." });
    }

    const prompt = generatePrompt(ingredients)

    res.set({
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    });
    res.flushHeaders();

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-lite-preview-06-17",
      contents: prompt,
    });

    let fullRecipeText = "";
    for await (const chunk of response) {
      if (chunk.text) {
        res.write(chunk.text);
        fullRecipeText += chunk.text;
      }
    }
    res.end();

    await Recipe.create({
      content: fullRecipeText,
      createdBy: req.userId,
    });

    console.log("Recipe saved to DB");
  } catch (error) {
    console.error("Gemini API error:", error.message || error);
    res.status(500).json({ error: "Failed to fetch recipe." });
  }
};