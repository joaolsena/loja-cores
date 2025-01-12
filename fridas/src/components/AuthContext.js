import React, { createContext, useState, useContext } from "react";

// Criação do contexto
const AuthContext = createContext();

// Hook para usar o contexto facilmente
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação

  const login = (password) => {
    const correctPassword = "123"; 
    if (password === correctPassword) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
