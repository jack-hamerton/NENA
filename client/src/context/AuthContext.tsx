"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthState, LoginInput, SignupInput } from "@/types";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { authService } from "@/services/auth.service";

interface AuthContextType extends AuthState {
  login: (data: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          // Fetch additional user data from our backend
          const userData = await authService.getCurrentUser(token);
          setState({
            user: userData,
            token: token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (data: LoginInput) => {
    await authService.login(data);
    // onAuthStateChanged will handle state update
  };

  const signup = async (data: SignupInput) => {
    await authService.signup(data);
    // onAuthStateChanged will handle state update
  };

  const logout = async () => {
    await authService.logout();
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
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
