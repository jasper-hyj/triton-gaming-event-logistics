// lib/auth/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserClient } from "@/lib/auth/fetchUserClient";
import { User } from "@/lib/auth/User";

type UserContextValue = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserClient()
      .then((fetchedUser) => {
        setUser(fetchedUser);
      })
      .finally(() => setLoading(false));
  }, []);

  return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
}

export function useAppUser() {
  return useContext(UserContext);
}
