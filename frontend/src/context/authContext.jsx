import Cookies from "js-cookie";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); 

  // On mount, read user info from localStorage and cookies for persistence
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = Cookies.get("authToken");
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        Cookies.remove("authToken");
      }
    }
    setAuthChecked(true); 
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
    setAuthChecked(true); 
  };

  const checkAuth = () => {
    const token = Cookies.get("authToken");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setAuthenticated(true, userData);
      } catch (error) {
        console.error("Error parsing user data in checkAuth:", error);
        setAuthenticated(false, null);
      }
    } else {
      setAuthenticated(false, null);
    }
    setAuthChecked(true);
  };

  const logout = () => {
    Cookies.remove("authToken", { path: "/" }); 
    localStorage.removeItem("user");
    setAuthenticated(false, null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, checkAuth, logout, user, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};