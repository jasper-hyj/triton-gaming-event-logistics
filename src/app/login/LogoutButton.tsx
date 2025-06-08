"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const LogoutButton = () => {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Logout failed. Please try again.");
      setLoggingOut(false);
      return;
    }
    setTimeout(() => {
      router.replace("/");
    }, 600);
  };

  return (
    <motion.button
      onClick={handleLogout}
      disabled={loggingOut}
      aria-label="Logout"
      aria-disabled={loggingOut}
      aria-busy={loggingOut}
      className="w-full px-6 py-3 rounded-md text-white font-semibold shadow-md"
      initial={{ scale: 1 }}
      whileTap={{ scale: 0.96 }}
      animate={{
        backgroundColor: loggingOut ? "#f87171" : "#dc2626",
        cursor: loggingOut ? "not-allowed" : "pointer",
      }}
      whileHover={!loggingOut ? { scale: 1.05 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {loggingOut ? "Logging out..." : "Logout"}
    </motion.button>
  );
};

export default LogoutButton;
