
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from "@/components/ui/sonner";

// Mock user data types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'tender_poster' | 'tender_seeker' | 'admin' | 'super_admin';
  avatar?: string;
  joinDate: string;
  company?: string;
  location?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'tender_poster' | 'tender_seeker') => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('garinhca_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAuthenticated = !!user;

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      if (email && password) {
        let role: 'tender_poster' | 'tender_seeker' | 'admin' | 'super_admin' = 'tender_seeker';
        
        // Determine role based on email for demo purposes
        if (email.includes('admin')) {
          role = 'admin';
        } else if (email.includes('superadmin')) {
          role = 'super_admin';
        } else if (email.includes('poster')) {
          role = 'tender_poster';
        }
        
        // Mock successful login
        const mockUser: User = {
          id: '123',
          name: email.split('@')[0],
          email,
          role,
          joinDate: new Date().toISOString(),
        };
        
        setUser(mockUser);
        localStorage.setItem('garinhca_user', JSON.stringify(mockUser));
        toast.success("Login successful!");
        return true;
      }
      toast.error("Invalid credentials");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string, role: 'tender_poster' | 'tender_seeker') => {
    try {
      // In a real app, this would be an API call
      if (name && email && password) {
        // Mock successful registration
        const mockUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          email,
          role,
          joinDate: new Date().toISOString(),
        };
        
        setUser(mockUser);
        localStorage.setItem('garinhca_user', JSON.stringify(mockUser));
        toast.success("Registration successful!");
        return true;
      }
      toast.error("Registration failed. Please provide all required information.");
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('garinhca_user');
    toast.success("Logged out successfully");
  };
  
  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        toast.error("You must be logged in to update your profile");
        return false;
      }
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('garinhca_user', JSON.stringify(updatedUser));
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Profile update failed. Please try again.");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
