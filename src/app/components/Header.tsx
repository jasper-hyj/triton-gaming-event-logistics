"use client";
import Link from "next/link";
import Image from "next/image";
import TGLogo from "@/img/TG Color Logo.png";
import { useUser } from "@/app/login/UserContext";

export default function Header() {
  const { user } = useUser();

  return (
    <header className="mb-10 flex flex-col sm:flex-row items-center justify-center text-center gap-4 sm:gap-6">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
        <Image
          src={TGLogo}
          alt="Triton Gaming Logo"
          width={80}
          height={80}
          className="object-contain"
          priority
        />
      </div>

      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
          Triton Gaming ELO
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">Look for anything you need.</p>
      </div>

      {!user ? (
        <Link
          href="/login"
          className="px-6 py-2 bg-cyan-800 text-white rounded-md hover:bg-cyan-700 transition"
        >
          Login
        </Link>
      ) : (
        <Link href="/account" className="px-6 py-2">
          <Image
            className="rounded-full"
            src={user.authUser.user_metadata.picture}
            alt=""
            width={40}
            height={40}
          />
        </Link>
      )}
    </header>
  );
}
