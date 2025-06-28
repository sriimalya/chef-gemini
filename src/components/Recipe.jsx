import { useState, useEffect } from 'react';


export default function Recipe({ingredients}) {
    const [recipe, setRecipe] = useState("loading..")

    useEffect(() => {
        async function getRecipe() {
            try {
                const res = await fetch("http://localhost:5000/get-recipe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ingredients}),
                });
                const data = await res.json();
                setRecipe(data.recipe || "No recipe returned.");
            } catch (err) {
                console.error("Fetch error:", err);
                setRecipe("Failed to load recipe.");
            }
        }

        getRecipe();
    }, [ingredients]);

    return (
        <div className="recipe-box">
            <h2>Generated Recipe:</h2>
            <pre>{recipe}</pre>
        </div>
    );
}