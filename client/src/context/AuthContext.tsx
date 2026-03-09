"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthState } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthContextType extends AuthState {
  login: (userData: { user: User; token: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("nena-token");
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          setState({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          localStorage.removeItem("nena-token");
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    initAuth();
  }, []);

  const login = ({ user, token }: { user: User; token: string }) => {
    localStorage.setItem("nena-token", token);
    setState({ user, token, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem("nena-token");
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
