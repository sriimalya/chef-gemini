import { useState, useRef, useTransition, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { lazy } from "react";

import useAuth from "../auth/useAuth";
import { fetchRecipe } from "../api/recipe";
import { addBookmark, removeBookmark } from "../api/bookmark";

const IngredientList = lazy(()=>import("../components/IngredientList"))
const Recipe = lazy(()=>import ("../components/Recipe"))

export default function Dashboard() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeId, setRecipeId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const recipeSection = useRef(null);
  const controllerRef = useRef(null);
  const recipeIdRef = useRef(null); // to make sure recipe id is updated immediately

  const handleSubmit = useCallback(
    (formData) => {
      const newIngredientName = formData.get("ingredient");
      if (
        newIngredientName &&
        !ingredients.some(
          (i) => i.name.toLowerCase() === newIngredientName.toLowerCase()
        )
      ) {
        const newIngredient = {
          id: uuidv4().slice(0, 8),
          name: newIngredientName,
        };
        setIngredients((prev) => [newIngredient, ...prev]);
      }
    },
    [ingredients]
  );

  const getRecipe = useCallback(async () => {
    if (!user) {
      alert("You must be logged in to generate recipes.");
      return;
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsGenerating(true);
    setLoading(true);
    setRecipe("");
    recipeIdRef.current = null;
    setRecipeId(null);
    setIsBookmarked(false);

    requestAnimationFrame(() => {
      recipeSection.current?.scrollIntoView({ behavior: "smooth" });
    });

    const timeout = setTimeout(() => {
      setRecipe("Chef Gemini is waking up... please wait ⏳");
    }, 8000);

    try {
      const reader = await fetchRecipe(
        ingredients.map((i) => i.name),
        controller.signal
      );
      clearTimeout(timeout);

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
        const match = buffer.match(/---RECIPE_ID:([a-f0-9]{24})---/);
        if (match && !recipeIdRef.current) {
          const id = match[1];
          recipeIdRef.current = id;
          setRecipeId(id);
          console.log("[Recipe ID]", id);
        }

        const filteredValue = value.replace(
          /---RECIPE_ID:([a-f0-9]{24})---/,
          ""
        );

        for (const char of filteredValue) {
          startTransition(() => {
            setRecipe((prev) => prev + char);
          });

          await new Promise((r) => setTimeout(r, 5));
        }
      }
    } catch (err) {
      clearTimeout(timeout);
      if (err.message.includes("Session timed out. Please refesh.")) {
        setRecipe("Session timed out. Please refresh.");
      } else{
        setRecipe("Failed to load recipe.");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
      setIsGenerating(false);
      controllerRef.current = null;
    }
  }, [user, ingredients, recipeId]);

  const removeIngredient = useCallback((id) => {
    setIngredients((prev) => {
      const newList = prev.filter((ingredient) => ingredient.id !== id);
      if (newList.length < 3) setRecipe("");
      return newList;
    });
  }, []);

  const stopGeneration = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const handleToggleBookmark = useCallback(async(id, isBookmarked)=>{
    if (!id) return;
    const isNowBookmarked = !isBookmarked
    setIsBookmarked(prev=>!prev)
    try{
      isNowBookmarked ? await addBookmark(id) : await removeBookmark(id);
      console.log(isNowBookmarked? "Bookmark added" : "Bookmark removed");
    } catch(err){
      console.error("Bookmark error:", err);
      alert("Could not update the bookmark. Try again.");
    }
  }, []);

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
        isBookmarked={isBookmarked}
        handleToggleBookmark={handleToggleBookmark}
      />
    </main>
  );
}
