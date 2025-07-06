export default function generatePrompt(ingredients){
    return `Create a delicious recipe using these main ingredients: ${ingredients.join(", ")}.

ASSUMPTIONS: You can assume the user has basic pantry staples like cooking oil, salt, black pepper, turmeric powder, red chili powder, cumin powder, coriander powder, garam masala, ginger-garlic paste, onions, and water. Please mention which of these staples you're using in your recipe.

REQUIREMENTS:
- Focus on Indian cuisine flavors and cooking techniques
- Mention if it's inspired from other cuisines too like Indian-Chinese, Italian, etc. in 1-2 lines.
- Provide exactly 5 clear, easy-to-follow steps
- Include precise measurements for all ingredients
- Mention cooking time and serving size
- Add tips for best results or variations if possible
- Format the response with clear headings: Recipe Name, Ingredients (mention the asumed ones separately in the same section), Instructions, Cooking Time, Serves, and Chef's Tip

Make the recipe authentic yet accessible for home cooking.`;

};