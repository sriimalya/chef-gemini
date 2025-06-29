import { useState } from "react";
import IngredientList from "./IngredientList";
import Recipe from "./Recipe";

export default function Main() {
  const [ingredients, setAddIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [recipe, setRecipe] = useState("");

  function handleSubmit(formData) {
    const newIngredient = formData.get("ingredient");
    if (newIngredient) {
      setAddIngredients([newIngredient, ...ingredients]);
    }
  }

  async function getRecipe() {
    setLoading(true);
    try {
      const res = await fetch("https://chef-gemini.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();
      setRecipe(data.recipe || "No recipe returned.");
    } catch (err) {
      console.error("Fetch error:", err);
      setRecipe("Failed to load recipe.");
    } finally {
    setLoading(false);
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


      <IngredientList ingredients={ingredients} getRecipe={getRecipe} />

      { recipe.length > 0 || loading ? <Recipe recipe={recipe} loading={loading} /> : null }
    </main>
  );
}
