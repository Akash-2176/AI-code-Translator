import { useState } from "react";
import { registerUser } from "../api";
import "./RegisterPage.css";  // Assuming you have a CSS file for styles

function RegisterPage({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Basic email validation regex
  const isValidEmail = (email) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
  // Basic password validation (at least 8 characters)
  const isValidPassword = (password) => password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!username || !email || !password) {
      setLoading(false);
      setError("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      setLoading(false);
      setError("Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(password)) {
      setLoading(false);
      setError("Password must be at least 8 characters.");
      return;
    }

    const result = await registerUser(username, email, password);
    setLoading(false);
    if (result.success) {
      alert("Registration successful!");
      onRegister();
    } else {
      setError(result.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="switch-action">
        <p>Already have an account? <span onClick={onSwitchToLogin}>Login</span></p>
      </div>
    </div>
  );
}

export default RegisterPage;
