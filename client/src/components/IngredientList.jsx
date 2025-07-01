import { Trash2 } from 'lucide-react';

export default function IngredientList({ ingredients, getRecipe, removeIngredient }) {
  const ingredientListItems = ingredients.map((ingredient) => (
    <li key={ingredient.id}>
      <div className='list-content'>
        <span className='ingredient-name'>{ingredient.name}</span>  
        <button className='remove-icon' onClick={()=>removeIngredient(ingredient.id)}><Trash2 size={20} /></button>
      </div>
    </li>

  ));

  return (
    <>
      <div className="ingredient-list-section">
        <h1>Ingredients on Hand:</h1>

        {ingredients.length > 0 ? (
          <>
            <ul className="ingredient-list">{ingredientListItems}</ul>
            {ingredients.length < 3 && (
              <p className="not-enough-ingredient">
                *add at least 3 ingredients to generate a recipe.
              </p>
            )}
          </>
        ) : (
          <p>You've not added any ingredients yet.</p>
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
