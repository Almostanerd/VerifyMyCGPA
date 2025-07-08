// src/pages/RegistrarLogin.jsx
import { useState } from "react";

function RegistrarLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === import.meta.env.VITE_REGISTRAR_PASSWORD) {
      localStorage.setItem("isRegistrar", "true");
      onLogin();
    } else {
      setError("❌ Invalid registrar password.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-box">
        <h2 className="dashboard-title">Registrar Login</h2>
        <input
          type="password"
          placeholder="Enter Registrar Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="dashboard-input"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={handleLogin} className="dashboard-button">
          🔐 Login
        </button>
      </div>
    </div>
  );
}

export default RegistrarLogin;
