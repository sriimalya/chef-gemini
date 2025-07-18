import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Header from '../components/Header'
import { getAccessToken } from "../auth/tokenStore";
import ReactMarkdown from "react-markdown";

export default function BookmarkedRecipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipeById() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/get-recipe/${id}`,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          }
        );
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error("Failed to load recipe:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipeById();
  }, [id]);

  if (loading) return <Loader />;
  if (!recipe)
    return <div style={{ textAlign: "center" }}>Recipe not found</div>;

  return (
    <>
    <Header />
    <div className="bookmarked-recipe-container">
      <h1>Recipe</h1>
      <div className="recipe-box">
        <ReactMarkdown>{recipe.content}</ReactMarkdown>
      </div>
    </div>
    </>
  );
}
