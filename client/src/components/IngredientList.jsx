import { X, PlusIcon, CircleStop } from "lucide-react";

export default function IngredientList({
  ingredients,
  handleSubmit,
  getRecipe,
  removeIngredient,
  isGenerating,
  stopGeneration,
}) {
  const ingredientListItems = ingredients.map((ingredient) => (
    <li key={ingredient.id}>
      <div className="list-content">
        <span className="ingredient-name">{ingredient.name}</span>
        {isGenerating ? (
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
      {/* form - (header, form-input, ingredient-list, warning, get-recipe button/stop button) */}

      <div className="ingredient-container">
        {/* header */}
        <div className="ingredient-header">
          <span className="plus-icon">
            <PlusIcon />
          </span>
          <div className="form-headings">
            <h2>Add Your Ingredients</h2>
            <p>Your ingredients, our recipes.</p>
          </div>
        </div>

        <div className="ingredient-form">
          {/* form-input */}
          <form action={handleSubmit} className="input-section">
            <input
              type="text"
              placeholder="Type an ingredient (e.g., rice)"
              aria-label="Add Ingredient"
              name="ingredient"
            />
            <button type="submit" className="add-button">
              <span class="text">Add</span>
              <span class="icon">
                <PlusIcon size={20} />
              </span>
            </button>
          </form>

          <div className="ingredient-list-section">
            {/* ingredient-list */}
            {ingredients.length > 0 ? (
              <div className="ingredient-list">
                <ul>{ingredientListItems}</ul>
              </div>
            ) : (
              <p className="no-ingredients">No ingredients yet.</p>
            )}

            {/* warning */}
            {ingredients.length > 0 && ingredients.length < 2 && (
              <div className="warning">⚠️ min. 2 ingredients required.</div>
            )}
          </div>

          {/* get-recipe/stop-recipe button */}
          <div>
            {isGenerating ? (
              <button onClick={stopGeneration} className="stop-btn">
                <span className="stop-icon"><CircleStop/></span>
                Stop generating recipe</button>
            ) : (
              <button
                onClick={ingredients.length >= 2 ? getRecipe : undefined}
                className="get-recipe-btn"
                disabled={ingredients.length < 2}
              >
                Get a recipe with Chef Gemini
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
