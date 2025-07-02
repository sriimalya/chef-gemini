import { useState, useEffect, useRef } from "react";
import IngredientList from "./IngredientList";
import Recipe from "./Recipe";
import { v4 as uuidv4 } from "uuid";

export default function Main() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [recipe, setRecipe] = useState("");
  const [recipeStale, setRecipeStale] = useState(false);

  const recipeSection = useRef(null)

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
    setRecipeStale(false);
    setLoading(true);
    try {
      const res = await fetch("https://chef-gemini.onrender.com/get-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredients.map((i) => i.name) }),
      });
      const data = await res.json();
      if(res.status === 500 || data.error?.code === 500){
        setRecipe("Chef Gemini is currently handling too many requests. Please try again shortly.")
      } else{
        setRecipe(data.recipe || "No recipe returned.");
      }
    } catch (err) {
      setRecipe("Failed to load recipe.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{  
    if(loading && recipeSection.current){
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading])

  function removeIngredient(id) {
    const newIngredients = ingredients.filter(
      (ingredient) => ingredient.id !== id
    );
    setIngredients(newIngredients);
    if (newIngredients.length < 3) setRecipe("");
    setRecipeStale(true);
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

      {recipe.length > 0 || loading ? (
        <Recipe recipeRef={recipeSection} recipe={recipe} loading={loading} />
      ) : null}
    </main>
  );
}
