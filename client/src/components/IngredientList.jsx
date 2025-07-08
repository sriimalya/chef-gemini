import { X } from "lucide-react";

export default function IngredientList({
  ingredients,
  getRecipe,
  removeIngredient,
  loading,
  isGenerating,
  stopGeneration,
}) {
  const ingredientListItems = ingredients.map((ingredient) => (
    <li key={ingredient.id}>
      <div className="list-content">
        <span className="ingredient-name">{ingredient.name}</span>
        {loading ? (
          ""
        ) : (
          <button
            className="remove-icon"
            onClick={() => removeIngredient(ingredient.id)}
          >
            <X />
          </button>
        )}
      </div>
    </li>
  ));

  return (
    <>
      <div className="ingredient-list-section">
        <h1>Ingredients on Hand:</h1>

        {ingredients.length > 0 ? (
          <div className="ingredient-list">
            <ul>{ingredientListItems}</ul>
            {ingredients.length < 3 && (
              <p className="not-enough-ingredient">
                *add at least 3 ingredients to generate a recipe.
              </p>
            )}
          </div>
        ) : (
          <p>You've not added any ingredients yet.</p>
        )}
      </div>
      {
        <div className="get-recipe">
          {isGenerating ? (
            <button onClick={stopGeneration}>Stop</button>
          ) : (
            <button onClick={getRecipe}>Get a recipe</button>
          )}
        </div>
      }
    </>
  );
}
