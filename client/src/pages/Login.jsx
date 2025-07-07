import useAuth from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useActionState } from "react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [user, submitAction, isPending] = useActionState(handleLogin, {
    data: null,
    error: null,
  });

  async function handleLogin(prevState, formData) {
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await login(username, password);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        ...prevState, 
        error: error?.response?.data?.error || error.message || "Login failed" 
      };
    }
  }

  useEffect(() => {
    if (user?.data) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <main>
      <form action={submitAction} className="form-container">
        <h2>Login to your account</h2>

        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Enter your username"
          className="form-input"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          className="form-input"
          required
        />
        <button type="submit" disabled={isPending} className="form-button">
          {isPending ? "Logging in..." : "Login"}
        </button>
        {user?.error && <div className="form-error">{user.error}</div>}
      </form>
    </main>
  );
}
