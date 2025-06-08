"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/lib/auth/User";
import { fetchUserClient } from "@/lib/auth/fetchUserClient";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

type UserContextType = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  const refreshUser = async () => {
    setLoading(true);
    const fetched = await fetchUserClient();
    setUser(fetched);
    setLoading(false);
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      // Automatically refresh the user when auth state changes
      refreshUser();
    });

    return () => {
      listener.subscription?.unsubscribe();
    };
  }, [supabase.auth]);

  return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
