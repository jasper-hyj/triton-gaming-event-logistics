"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "../login/LogoutButton";
import useUserClient from "@/hooks/useUserClient";

export default function Account() {
  const router = useRouter();
  const { data: user } = useUserClient();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;
    setLoading(false);
    if (!user) router.replace("/");
  }, [user, router]);
  return (
    <>
      {loading ? (
        <p className="text-center mt-24 text-gray-500 text-lg font-light tracking-wide">
          Loading user info...
        </p>
      ) : (
        <>
          {user ? (
            <main className="bg-white px-8 py-16 max-w-lg mx-auto rounded-lg shadow-lg flex flex-col items-center text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
                User Information
              </h1>
              <div className="bg-gray-50 p-8 rounded-xl shadow-md w-full border border-gray-200 text-left">
                <p className="text-xl text-gray-700 mb-4">
                  <span className="font-semibold">Name:</span>{" "}
                  {user.user_metadata?.full_name || "N/A"}
                </p>
                <p className="text-xl text-gray-700 mb-4">
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p className="text-xl text-gray-700 mb-4">
                  <span className="font-semibold">Role:</span> {user.role}
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
                <button
                  onClick={() => router.back()}
                  className="w-full px-6 py-3 rounded-md bg-zinc-700 hover:bg-zinc-800 text-white font-semibold transition-shadow shadow-md hover:shadow-lg"
                  aria-label="Go back"
                >
                  Go Back
                </button>
                <LogoutButton />
              </div>
            </main>
          ) : (
            <p className="text-center mt-24 text-gray-500 text-lg font-light tracking-wide">
              Redirecting...
            </p>
          )}
        </>
      )}
    </>
  );
}
