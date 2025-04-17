import { createContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to handle login
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));  // Save user data
    setUser(userData);
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user from storage
  };

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
