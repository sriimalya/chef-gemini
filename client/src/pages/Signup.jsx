import { useEffect, useActionState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function Signup() {
  const { signup, user, loading } = useAuth();
  const navigate = useNavigate();

  if (!loading && user) {
    navigate("/");
  }

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
    <main>
      <form action={handleSignup} className="form-container">
        <h2>Create Account</h2>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          className="form-input"
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="text"
          placeholder="Email"
          className="form-input"
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="form-input"
          required
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </button>

        {signedUpState?.error && (
          <div className="form-error">{signedUpState.error}</div>
        )}
      </form>
    </main>
  );
}
