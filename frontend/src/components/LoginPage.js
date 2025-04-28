import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import navigate
import { loginUser } from "../api";
import "./LoginPage.css";

function LoginPage({ onLogin, onSwitchToRegister }) {
  const navigate = useNavigate(); // 👈 initialize navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Submitting login form with:", { email, password });

    if (!email || !password) {
      setLoading(false);
      setError("Please fill in all fields.");
      console.log("Validation failed: Email or Password is missing");
      return;
    }

    const result = await loginUser(email, password);
    console.log("Login result:", result);

    setLoading(false);
    if (result.success) {
      const userData = { token: result.token, username: result.username };
      console.log("Login successful:", userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Store user
      onLogin(userData); // Update App state
      navigate('/translator'); // 👈 Redirect after login success
    } else {
      console.log("Login failed:", result.message);
      setError(result.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="switch-action">
        <p>Don't have an account? <span onClick={onSwitchToRegister}>Register</span></p>
      </div>
    </div>
  );
}

export default LoginPage;
