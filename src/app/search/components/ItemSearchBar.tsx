"use client";

import Image from "next/image";
import qrcodeSVG from "@/img/qrcode-solid.svg";
import { useState } from "react";
import QRCodeScanner from "@/app/components/QRCodeScanner";

type ItemSearchBarProps = {
  query: string;
  setQuery: (id: string) => void;
  loading: boolean;
  handleSearch: () => Promise<void>;
};

export default function ItemSearchBar({
  query,
  setQuery,
  loading,
  handleSearch,
}: ItemSearchBarProps) {
  const [scannerVisible, setScannerVisible] = useState(false);

  const handleScanned = async (scanned: string) => {
    setQuery(scanned);
    setScannerVisible(false);
    await handleSearch(); // auto-search
  };

  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Search for an Item</h1>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        <input
          className="w-full sm:w-auto max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          placeholder="Search by item ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          disabled={loading}
        />

        <button
          onClick={() => setScannerVisible((prev) => !prev)}
          aria-label="Scan QR Code"
          className="p-2 rounded hover:bg-gray-200 transition"
        >
          <Image src={qrcodeSVG} alt="QR Code Icon" height={24} />
        </button>

        <button
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 text-sm sm:text-base"
          onClick={handleSearch}
          disabled={loading}
        >
          🔍 Search
        </button>
      </div>

      {scannerVisible && (
        <div className="mt-4">
          <QRCodeScanner onScan={handleScanned} />
        </div>
      )}
    </>
  );
}
