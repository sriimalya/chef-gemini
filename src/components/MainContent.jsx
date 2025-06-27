import { useState } from "react";

export default function Main() {
  const [ingredients, setAddIngredients] = useState([]);

  function handleSubmit(formData) {
    const newIngredient = formData.get("ingredient");
    if (newIngredient) {
      setAddIngredients([newIngredient, ...ingredients]);
    }
  }

  const ingredientListItems = ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>);
  console.log(ingredientListItems)
  console.log(typeof(ingredientListItems))


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
      <div className="ingredient-list-section">
        <h1>Ingredients on Hand:</h1>

        {ingredients.length > 0 && <ul className="ingredient-list">{ingredientListItems}</ul>}

        {
          ingredients.length > 0 &&
          <div className="get-recipe">
          <div>
            <h3>Ready for a recipe?</h3>
            <p>Generate a recipe from your list of ingredients.</p>
          </div>
          <button>Get a recipe</button>
          </div>
        }
      </div>
    </main>
  );
}
