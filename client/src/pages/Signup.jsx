import { useEffect, useActionState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function Signup() {
  const { signup, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  const [signedUpState, submitAction, isPending] = useActionState(
    handleSignup,
    {
      data: null,
      error: null,
    }
  );

  async function handleSignup(prevState, formData) {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const user = await signup(username, email, password);
      return { data: user, error: null };
    } catch (error) {
      return {
        ...prevState,
        error: error?.response?.data?.error || error.message || "Signup failed",
      };
    }
  }

  useEffect(() => {
    if (signedUpState?.data) {
      navigate("/");
    }
  }, [signedUpState, navigate]);

  return (
    <main className="auth-form-container">
      <form action={submitAction} className="auth-form">
      <h2>Create Account</h2>

        <div className="form-field">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Username"
            className="form-input"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            className="form-input"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            className="form-input"
            required
          />
        </div>

        <button type="submit" disabled={isPending} className="form-button">
          {isPending ? "Signing up..." : "Signup"}
        </button>

        {signedUpState?.error && (
          <div className="form-error">{signedUpState.error}</div>
        )}
      </form>

      <div>Already have an account?</div>
      <NavLink to="/login">Login</NavLink>
    </main>
  );
}
