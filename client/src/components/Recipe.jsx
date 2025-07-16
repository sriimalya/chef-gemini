import ReactMarkdown from "react-markdown";
import { Copy, CheckCheck, Bookmark, BookmarkCheck } from "lucide-react";
import { useState, useRef } from "react";

export default function Recipe({
  recipeRef,
  recipe,
  loading,
  isGenerating,
  recipeId,
  addToBookmark,
}) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

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

  async function handleBookmark() {
    if (!recipeId || bookmarked) return;
    try {
      await addToBookmark(recipeId); 
      setBookmarked(true);
    } catch (err) {
      console.error("Failed to bookmark recipe:", err);
    }
  }

  return (
    <div
      ref={recipeRef}
      className={loading || recipe.length > 0 ? "recipe-box" : undefined}
    >
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

      {recipe.length > 0 && (
        <>
          {!isGenerating && (
            <div className="recipe-header">
              <h2>Recipe by Chef Gemini:</h2>
              <div className="recipe-header-actions">
                <button
                  onClick={handleCopy}
                  aria-label="Copy recipe"
                  title="Copy recipe"
                  className="copy-btn"
                >
                  {copied ? (
                    <>
                      <CheckCheck size={20} />
                      <span className="copy-text">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      <span className="copy-text">Copy</span>
                    </>
                  )}
                </button>

                {recipeId && (
                  <button
                    onClick={handleBookmark}
                    aria-label="Bookmark recipe"
                    title="Bookmark recipe"
                    className="bookmark-btn"
                    disabled={bookmarked}
                  >
                    {bookmarked ? (
                      <>
                        <BookmarkCheck size={20} />
                        <span className="copy-text">Bookmarked</span>
                      </>
                    ) : (
                      <>
                        <Bookmark size={20} />
                        <span className="copy-text">Bookmark</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          <div ref={markdownRef}>
            <ReactMarkdown>{recipe}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}
