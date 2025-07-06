import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

const baseUrl = import.meta.env.VITE_API_URL;

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/user/login`, {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      const userData = {
        id: data.id,
        username: data.username,
        token: data.access_token,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error login:", error);
    } finally {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
