
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from "@/components/ui/sonner";

// Mock user data types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'tender_poster' | 'tender_seeker' | 'admin' | 'super_admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'tender_poster' | 'tender_seeker') => Promise<boolean>;
  logout: () => void;
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
        // Mock successful login
        const mockUser: User = {
          id: '123',
          name: email.split('@')[0],
          email,
          role: email.includes('admin') ? 'admin' : email.includes('poster') ? 'tender_poster' : 'tender_seeker',
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

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
