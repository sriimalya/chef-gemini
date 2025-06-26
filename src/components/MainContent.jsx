export default function Main() {

  const ingredients = []

  function handleSubmit(e) {
    e.preventDefault();
    console.log("form submit");
    const formData = new FormData(e.currentTarget);
    const newIngredient = formData.get("ingredient");
    ingredients.unshift(newIngredient)
    console.log(newIngredient);
    console.log(ingredients)
  }
  return (
    <main>
      <form className="search-section" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add Ingredient"
          name="ingredient"
        />
        <button>+ Add Ingredient</button>
      </form>
    </main>
  );
}
