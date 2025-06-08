"use client";

import Image from "next/image";
import qrcodeSVG from "@/img/qrcode-solid.svg";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center text-center gap-8 mt-10 px-4">
      <h2 className="text-2xl sm:text-3xl font-medium text-gray-700">Welcome to the ELO System</h2>

      <Link
        href="/search"
        className="px-5 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 text-sm sm:text-base"
      >
        🔍 Search for Items
      </Link>
      <Link
        href="/search/location"
        className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition duration-200 text-sm sm:text-base"
      >
        📍 Search for Locations
      </Link>

      <div className="w-full max-w-md border-t border-gray-200 pt-6">
        <p className="text-gray-400 text-sm">Small Tools</p>
      </div>
      <Link
        href="/qrcode"
        className="flex flex-col sm:flex-row items-center justify-center px-5 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-700 transition duration-200 text-sm sm:text-base flex"
      >
        <Image src={qrcodeSVG} alt={""} height={24} className="me-2" />
        QRCode Generator
      </Link>
    </main>
  );
}
