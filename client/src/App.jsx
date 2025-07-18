import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./auth/AuthProvider";
import useAuth from "./auth/useAuth";
import Loader from "./components/Loader";

const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Bookmark = lazy(() => import("./pages/Bookmarks"));
const BookmarkedRecipe = lazy(()=> import("./pages/BookmarkedRecipe"))

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmark />
                </ProtectedRoute>
              }
            />
            <Route path="/get-recipe/:id" element={<BookmarkedRecipe />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}
