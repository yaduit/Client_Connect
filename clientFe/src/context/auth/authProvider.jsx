import { useState, useEffect } from "react";
import { AuthContext } from "./authContext.js";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Initialize auth state from localStorage (user only, token is in cookie)
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsedUser = JSON.parse(stored);
          
          // Validate that we have user data
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
          } else {
            // Clear invalid user data
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ✅ Login: Store user in localStorage (token is in httpOnly cookie)
  const login = ({ user }) => {
    if (!user) {
      console.error("Login failed: user is required");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  // ✅ Logout: Clear user from localStorage (cookie cleared by backend)
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ Update user data (for profile updates or role changes)
  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      console.error("Cannot update user: user data is required");
      return;
    }

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null, // ✅ Token is in httpOnly cookie, not accessible to JS
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;