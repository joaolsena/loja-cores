import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      navigate("/"); // Redireciona para a página inicial após o login
    } else {
      alert("Senha incorreta!");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Digite a senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"  // Adicionado className
        />
        <button type="submit" className="login-button">Entrar</button> {/* Adicionado className */}
      </form>
    </div>
  );
};

export default Login;
