export default function IngredientList({ingredients, toggleRecipe}){

    const ingredientListItems = ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>);

    return (
        <>
        {ingredients.length > 0 && <ul className="ingredient-list">{ingredientListItems}</ul>}
        {
          ingredients.length > 2 &&
          <div className="get-recipe">
          <div>
            <h3>Ready for a recipe?</h3>
            <p>Generate a recipe from your list of ingredients.</p>
          </div>
          <button onClick={toggleRecipe}>Get a recipe</button>
          </div>
        }
      </>
    )
}