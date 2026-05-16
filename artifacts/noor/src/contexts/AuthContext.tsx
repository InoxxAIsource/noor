import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { getMe } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";

const TOKEN_KEY = "tazki_token";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  setAuthUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // Support migration from old deen_token key
  const storedTokenInit = localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem("deen_token");
  const [token, setToken] = useState<string | null>(storedTokenInit);
  // If a token already exists in localStorage, trust it immediately — no flash.
  // Background validation will silently log out if the token is truly invalid.
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAuthTokenGetter(() => localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem("deen_token"));

    const validateToken = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem("deen_token");
      if (storedToken) {
        try {
          const userData = await getMe();
          setUser(userData);
          // Migrate old token key silently
          if (!localStorage.getItem(TOKEN_KEY)) {
            localStorage.setItem(TOKEN_KEY, storedToken);
            setToken(storedToken);
          }
        } catch {
          // Token is invalid — silently clear and redirect
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem("deen_token");
          setToken(null);
          setUser(null);
        }
      }
    };

    validateToken();
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.removeItem("deen_token");
    setToken(newToken);
    getMe().then(setUser).catch(console.error);
  };

  const setAuthUser = (nextUser: User | null) => {
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("deen_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!token, token, login, logout, isLoading, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
