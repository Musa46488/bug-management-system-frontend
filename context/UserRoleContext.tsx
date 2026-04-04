"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type UserRoleContextType = {
  role: string | null;
  setRole: (role: string) => void;
};

const UserRoleContext = createContext<UserRoleContextType | undefined>(
  undefined
);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const storedRole =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const [role, setRole] = useState<string | null>(storedRole);

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    }
  }, [role]);

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};
