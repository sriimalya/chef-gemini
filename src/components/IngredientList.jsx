export default function IngredientList({ ingredients, getRecipe }) {
  const ingredientListItems = ingredients.map((ingredient, i) => (
    <li key={i}>{ingredient}</li>
  ));

  return (
    <>
      <div className="ingredient-list-section">
        <h1>Ingredients on Hand:</h1>

        {ingredients.length > 0 ? (
          <ul className="ingredient-list">{ingredientListItems}</ul>
        ) : (
          <p>You've not added any ingredients yet</p>
        )}
      </div>
      {ingredients.length > 2 && (
        <div className="get-recipe">
          <div>
            <h3>Ready for a recipe?</h3>
            <p>Generate a recipe from your list of ingredients.</p>
          </div>
          <button onClick={getRecipe}>Get a recipe</button>
        </div>
      )}
    </>
  );
}
