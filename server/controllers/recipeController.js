import { GoogleGenAI } from "@google/genai";
import Recipe from "../models/Recipe.js";
import generatePrompt from "../utils/prompt.js";

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

    const prompt = generatePrompt(ingredients);

    res.set({
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    });
    res.flushHeaders();

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-lite-preview-06-17",
      contents: prompt,
    });

    let recipeChunks = [];
    let aborted = false;
     req.on("close", () => {
      aborted = true;
      console.log('Client disconnected');
    });
    try{
      for await (const chunk of response) {
        if(aborted) break;
        if (chunk.text) {
          try {
            res.write(chunk.text);
            recipeChunks.push(chunk.text); 
          } catch (err) {
            // disconnection during write
            console.warn("[Stream] Write failed (likely client abort):", err);
            aborted = true;
            break;
          }
        }
      }

      if(!aborted && recipeChunks.length>0){
        const fullRecipeText = recipeChunks.join('');
        try{
          const savedRecipe = await Recipe.create({
            content: fullRecipeText,
            createdBy: req.userId,
          });
          res.end(`\n\n---RECIPE_ID:${savedRecipe._id}---`);
          console.log("[DB] Recipe saved.");
        } catch(dbErr){
          console.error("DB save failed:", dbErr);
          res.end('\n\n---RECIPE_SAVE_FAILED---');
        }
      } else{
        res.end(); // clean end for aborted streams
      }

    } catch(streamErr){
      console.error("[STREAM] Streaming error:", streamErr);
      if (!res.headersSent) {
        res.status(500).json({ error: "Streaming failed." });
      } else {
        res.end();
      }
    }
  } catch (error) {
    console.error("Initial error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else{
      res.end();
    }
  }
};
