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
import Layout from "./components/Layout";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
const Bookmark = lazy(() => import("./pages/Bookmarks"));
const BookmarkedRecipe = lazy(() => import("./pages/BookmarkedRecipe"));

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
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="bookmarks" element={<Bookmark />} />
              <Route path="get-recipe/:id" element={<BookmarkedRecipe />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}
