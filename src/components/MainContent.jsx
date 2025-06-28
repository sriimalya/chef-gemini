import { useState } from "react";
import IngredientList from "./IngredientList";
import Recipe from "./Recipe";

export default function Main() {
  const [ingredients, setAddIngredients] = useState([]);
  const [isShown, setIsShown] = useState(false)

  function handleSubmit(formData) {
    const newIngredient = formData.get("ingredient");
    if (newIngredient) {
      setAddIngredients([newIngredient, ...ingredients]);
    }
  }

  function toggleRecipe(){
    setIsShown(prevShown => !prevShown)
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

      <div className="ingredient-list-section">

        <h1>Ingredients on Hand:</h1>

        {ingredients.length > 0 ? <IngredientList ingredients={ingredients} toggleRecipe={toggleRecipe}/>  : <p>You've not added any ingredients yet</p>}

      </div>

      {isShown && <Recipe ingredients={ingredients}/>}
    </main>
  );
}
