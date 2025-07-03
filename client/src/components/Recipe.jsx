import ReactMarkdown from "react-markdown";
import { Copy } from "lucide-react";
import { useState, useRef } from "react";

export default function Recipe({ recipeRef, recipe, loading }) {
  const [copied, setCopied] = useState(false);

  const markdownRef = useRef(null);

  function handleCopy() {
    if (markdownRef.current) {
      const recipeText = markdownRef.current.innerText;
      navigator.clipboard
        .writeText(recipeText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1000);
        })
        .catch((err) => {
          console.error("failed to copy", err);
        });
    }
  }

return (
  <div
    ref={recipeRef}
    className={
      loading || recipe.length > 0 ? "recipe-box" : undefined
    }
  >
    {loading && recipe.length === 0 ? (
      <>
        <h2>Generating your recipe...</h2>
        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </>
    ) : recipe.length > 0 ? (
      <>
        <div className="recipe-header">
          <h2>Recipe by Chef Gemini:</h2>
          <button
            onClick={handleCopy}
            aria-label="Copy recipe"
            className="copy-btn"
          >
            {copied ? (
              <span>Copied</span>
            ) : (
              <>
                <Copy size={20} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <div ref={markdownRef}>
          <ReactMarkdown>{recipe}</ReactMarkdown>
        </div>
      </>
    ) : null}
  </div>
);

}
