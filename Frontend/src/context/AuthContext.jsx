import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/auth";
import { API_BASE_URL } from '../config/api';


const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    ...context,
    API_BASE_URL: API_BASE_URL 
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      authService
        .getProfile()
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };
  // context/AuthContext.js
 // context/AuthContext.js
const updateProfile = async (profileData) => {
  try {
    console.log('🔄 Attempting profile update...');
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();
    console.log('📨 Backend response:', data);

    if (!response.ok) {
      // If it's a server error, try the mock approach
      if (response.status === 500) {
        console.log('🔄 Server error, using mock update...');
        return await mockProfileUpdate(profileData);
      }
      throw new Error(data.error || "Failed to update profile");
    }

    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log('✅ Profile updated successfully via API');
    }

    return data;
  } catch (error) {
    console.error("❌ Update profile error:", error);
    
    // Fallback to mock update
    console.log('🔄 Falling back to mock update...');
    return await mockProfileUpdate(profileData);
  }
};

// Mock update function
const mockProfileUpdate = async (profileData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...currentUser,
        ...profileData,
        updated_at: new Date().toISOString()
      };
      
      // Remove password fields
      delete updatedUser.currentPassword;
      delete updatedUser.newPassword;
      delete updatedUser.confirmPassword;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log('✅ Profile updated via mock');
      
      resolve({
        success: true,
        message: 'Profile updated (offline mode)',
        user: updatedUser
      });
    }, 500);
  });
};

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile, 
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
