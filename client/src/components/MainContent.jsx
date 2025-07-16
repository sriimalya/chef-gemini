import { useState, useRef, useTransition } from "react";
import { v4 as uuidv4 } from "uuid";

import { getAccessToken } from "../auth/tokenStore";
import useAuth from "../auth/useAuth";

import IngredientList from "./IngredientList";
import Recipe from "./Recipe";

export default function Main() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [recipe, setRecipe] = useState("");
  const [recipeStale, setRecipeStale] = useState(false);
  const [recipeId, setRecipeId] = useState(null);

  const recipeSection = useRef(null);
  const controllerRef = useRef(null); // tracking AbortController

  const [isGenerating, setIsGenerating] = useState(false);

  const [isPending, startTransition] = useTransition();

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
    setRecipeId(null);

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

      let isAborted = false;
      controller.signal.addEventListener("abort", () => {
        isAborted = true;
        reader.cancel();
        console.log("Generation aborted.");
      });

      let buffer = "";
      while (!isAborted) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += value;

        // extract recipeId marker if present
        const match = buffer.match(/---RECIPE_ID:([a-f0-9]{24})---/);
        if (match && !recipeId) {
          const id = match[1];
          setRecipeId(id);
          console.log("[Recipe ID]", id);
        }

        // filter out the RECIPE_ID marker before rendering
        const filteredValue = value.replace(
          /---RECIPE_ID:([a-f0-9]{24})---/,
          ""
        );

        for (const char of filteredValue) {
          startTransition(() => {
            setRecipe((prev) => prev + char);
          });
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

async function addToBookmark(id) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/bookmark/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    if (!res.ok) throw new Error("Failed to bookmark");

    console.log("Recipe bookmarked:", id);
  } catch (err) {
    console.error("Bookmark error:", err);
    alert("Could not bookmark the recipe. Try again.");
  }
}


  return (
    <main>
      <IngredientList
        ingredients={ingredients}
        handleSubmit={handleSubmit}
        getRecipe={getRecipe}
        removeIngredient={removeIngredient}
        loading={loading}
        isGenerating={isGenerating}
        stopGeneration={stopGeneration}
      />

      <Recipe
        recipeRef={recipeSection}
        recipe={recipe}
        loading={loading}
        isGenerating={isGenerating}
        recipeId={recipeId}
        addToBookmark={addToBookmark}
      />
    </main>
  );
}
