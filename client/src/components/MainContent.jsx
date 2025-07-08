import { useState, useRef } from "react";
import { getAccessToken } from "../auth/tokenStore";
import useAuth from "../auth/useAuth";

import IngredientList from "./IngredientList";
import Recipe from "./Recipe";
import { v4 as uuidv4 } from "uuid";

export default function Main() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [recipe, setRecipe] = useState("");
  const [recipeStale, setRecipeStale] = useState(false);

  const recipeSection = useRef(null);
  const controllerRef = useRef(null); // tracking AbortController

  const [isGenerating, setIsGenerating] = useState(false);

  function handleSubmit(formData) {
    const newIngredientName = formData.get("ingredient");
    if (newIngredientName) {
      const newIngredient = {
        id: uuidv4().slice(0, 8),
        name: newIngredientName,
      };
      setIngredients([newIngredient, ...ingredients]);
      setRecipeStale(true);
    }
  }

  async function getRecipe() {
    if (!user) {
      alert("You must be logged in to generate recipes.");
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setIsGenerating(true);
    setRecipeStale(false);
    setLoading(true);
    setRecipe("");

    requestAnimationFrame(() => {
      if (recipeSection.current) {
        recipeSection.current.scrollIntoView({ behavior: "smooth" });
      }
    });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/get-recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify({ ingredients: ingredients.map((i) => i.name) }),
          signal: controller.signal,
        }
      );

      if (res.status === 401) {
        setRecipe("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      if (res.status === 429) {
        setRecipe("You've hit the limit. Please try again after some time.");
        setLoading(false);
        return;
      }

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();

      let isAborted = false
      controller.signal.addEventListener("abort", ()=>{
        isAborted=true;
        reader.cancel();
        console.log("Generation aborted.");
      });

      while (!isAborted) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const char of value) {
          setRecipe((prev) => prev + char);
          await new Promise(requestAnimationFrame);
        }
      }

      if (res.status === 500) {
        setRecipe(
          "Chef Gemini is currently handling too many requests. Please try again shortly."
        );
      }
    } catch (err) {
        console.error(err);
        setRecipe("Failed to load recipe.");
    } finally {
      setLoading(false);
      setIsGenerating(false);
      controllerRef.current = null;
    }
  }

  function removeIngredient(id) {
    const newIngredients = ingredients.filter(
      (ingredient) => ingredient.id !== id
    );
    setIngredients(newIngredients);
    if (newIngredients.length < 3) setRecipe("");
    setRecipeStale(true);
  }

  function stopGeneration() {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }

  return (
    <main>
      <form className="search-section" action={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add Ingredient"
          name="ingredient"
        />
        <button type="submit">+ Add Ingredient</button>
      </form>

      <IngredientList
        ingredients={ingredients}
        getRecipe={getRecipe}
        removeIngredient={removeIngredient}
        loading={loading}
        isGenerating={isGenerating}
        stopGeneration={stopGeneration}
      />

      {recipe.length > 0 && recipeStale && ingredients.length >= 3 && (
        <div className="warning">
          <span className="warning-icon">⚠️</span>
          <div className="warning-text">
            <strong>Ingredient list changed.</strong>
            <br />
            Please regenerate the recipe to reflect the updated list.
          </div>
        </div>
      )}

      <Recipe
        recipeRef={recipeSection}
        recipe={recipe}
        loading={loading}
        isGenerating={isGenerating}
      />
    </main>
  );
}
