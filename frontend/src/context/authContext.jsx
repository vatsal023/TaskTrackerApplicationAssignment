import Cookies from "js-cookie";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  //on mount,read user info from localStorage for persistence
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = Cookies.get("authToken");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const setAuthenticated = (value, userData = null) => {
    setIsAuthenticated(value);
    if (value && userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const checkAuth = () => {
    const token = Cookies.get("authToken");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setAuthenticated(true, JSON.parse(storedUser));
    } else {
      setAuthenticated(false, null);
    }
  };

  const logout = () => {
    Cookies.remove("authToken");
    localStorage.removeItem("user");
    setAuthenticated(false, null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, checkAuth, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};