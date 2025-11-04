import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const backendUrl = "http://localhost:9000";

  // Set axios default authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
      fetchCurrentUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      setLoading(false);
    }
  }, [token]);

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/me`);
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Signup function
  const signup = async (name, email, password, role, department) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/signup`, {
        name,
        email,
        password,
        role,
        department,
      });

      if (response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;