import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { getMe } from "@workspace/api-client-react";
import type { User } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("deen_token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAuthTokenGetter(() => localStorage.getItem("deen_token"));
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem("deen_token");
      if (storedToken) {
        try {
          const userData = await getMe();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("deen_token");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    validateToken();
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("deen_token", newToken);
    setToken(newToken);
    // Ideally we'd fetch the user immediately, but usually login also redirects
    // which triggers a remount or subsequent fetches can use the new token.
    getMe().then(setUser).catch(console.error);
  };

  const logout = () => {
    localStorage.removeItem("deen_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!token, token, login, logout, isLoading }}>
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
