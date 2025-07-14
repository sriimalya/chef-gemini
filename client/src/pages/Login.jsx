import useAuth from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useActionState } from "react";
import { NavLink } from "react-router-dom";

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  const [loginState, submitAction, isPending] = useActionState(handleLogin, {
    data: null,
    error: null,
  });

  async function handleLogin(prevState, formData) {
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const user = await login(username, password);
      return { data: user, error: null };
    } catch (error) {
      return {
        ...prevState,
        error: error?.response?.data?.error || error.message || "Login failed",
      };
    }
  }

  useEffect(() => {
    if (loginState?.data) {
      navigate("/");
    }
  }, [loginState, navigate]);

  return (
    <main className="auth-form-container">
      <form action={submitAction} className="auth-form">
      <h2>Login to your account</h2>

        <div className="form-field">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            className="form-input"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="password"
            placeholder="Enter your password"
            className="form-input"
            required
          />
        </div>

        <button type="submit" disabled={isPending} className="form-button">
          {isPending ? "Logging in..." : "Login"}
        </button>

        {loginState?.error && (
          <div className="form-error">{loginState.error}</div>
        )}
      </form>

      <div>Don't have an account?</div>
      <NavLink to="/signup">Signup</NavLink>
    </main>
  );
}
