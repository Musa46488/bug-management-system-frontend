"use client";

import { createContext, useContext, useState } from "react";

interface User {
  id: string | null;
  name: string | null;
  role: string | null;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    if (typeof window === "undefined") {
      return { id: null, name: null, role: null };
    }

    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : { id: null, name: null, role: null };
  });

  const logout = () => {
    setUser({ id: null, name: null, role: null });
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    document.cookie = "access_token=; Max-Age=0; path=/";
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
