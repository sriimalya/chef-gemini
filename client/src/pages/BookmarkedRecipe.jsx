import { useEffect, useState } from "react";
import useAuth from "../auth/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { getAccessToken } from "../auth/tokenStore";
import ReactMarkdown from "react-markdown";

export default function BookmarkedRecipe() {
  const { user, loading} = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
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
        setLoadingRecipe(false);
      }
    }

    fetchRecipeById();
  }, [id, user, loading, navigate]);

  if (loadingRecipe) return <Loader />;
  if (!recipe)
    return <div style={{ textAlign: "center" }}>Recipe not found</div>;

  return (
    <>
      <div className="bookmarked-recipe-container">
        <h1>Recipe</h1>
        <div className="recipe-box">
          <ReactMarkdown>{recipe.content}</ReactMarkdown>
        </div>
      </div>
    </>
  );
}
