import ReactMarkdown from "react-markdown";
import { Copy, CheckCheck } from "lucide-react";
import { useState, useRef } from "react";

export default function Recipe({ recipeRef, recipe, loading, isGenerating }) {
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
      className={loading || recipe.length > 0 ? "recipe-box" : undefined}
    >
      {/* Loading state at the start of generation */}
      {isGenerating && (
        <div className="generating">
          <p>Generating recipe</p>
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {/* Recipe being streamed — content is showing */}
      {recipe.length > 0 && (
        <>
          {/* Only show header + copy when streaming is done */}
          {!isGenerating && (
            <div className="recipe-header">
              <h2>Recipe by Chef Gemini:</h2>
              <button
                onClick={handleCopy}
                aria-label="Copy recipe"
                title="Copy recipe"
                className="copy-btn"
              >
                {copied ? (
                  <>
                    <CheckCheck size={20}/>
                    <span className="copy-text">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    <span className="copy-text">Copy</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Markdown body (streaming or completed) */}
          <div ref={markdownRef}>
            <ReactMarkdown>{recipe}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}
