import { useEffect, useState } from "react";
import useAuth from "../auth/useAuth";
import ReactMarkdown from "react-markdown";
import { fetchBookmarks } from "../api/bookmark";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const navigate = useNavigate();
  const { user, loading} = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
    async function load() {
      try {
        const data = await fetchBookmarks();
        setBookmarks(data);
      } catch (err) {
        console.error("[Bookmark Page] Error fetching:", err);
      } finally {
        setLoadingBookmarks(false);
      }
    }

    load();
  }, [user, loading, navigate]);

  if (loadingBookmarks) return <Loader />;
  if (bookmarks.length === 0)
    return (
      <div className="bookmark-empty">
        You haven’t bookmarked any recipes yet.
      </div>
    );

  return (
    <>
      <div className="bookmark-page">
        <h2 className="bookmark-heading">Your Bookmarked Recipes</h2>
        <div className="bookmark-list">
          {bookmarks.map((bookmark) => (
            <Link
              key={bookmark._id}
              to={`/get-recipe/${bookmark.recipe?._id}`}
              className="bookmark-card"
            >
              <div className="bookmark-preview">
                <ReactMarkdown>
                  {bookmark.recipe?.content
                    ? `${bookmark.recipe.content.slice(0, 80)} ...`
                    : "Recipe not found..."}
                </ReactMarkdown>
              </div>

              <p className="bookmark-date">
                Bookmarked on: {new Date(bookmark.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
