import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { fetchBookmarks } from "../api/bookmark";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Header from "../components/Header";

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchBookmarks();
        setBookmarks(data);
      } catch (err) {
        console.error("[Bookmark Page] Error fetching:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <Loader />;
  if (bookmarks.length === 0)
    return (
      <div className="bookmark-empty">
        You haven’t bookmarked any recipes yet.
      </div>
    );

  return (
    <>
      <Header />
      <div className="bookmark-page">
        <h1 className="bookmark-heading">Your Bookmarked Recipes</h1>
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
                    ? `${bookmark.recipe.content.slice(0, 150)} ...`
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
