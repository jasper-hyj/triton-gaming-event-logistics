"use client";

import { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

type QRCodeScannerProps = {
  setScannedText: (text: string) => void;
  onCancel: () => void;
};

export default function QRCodeScanner({ setScannedText, onCancel }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        setScannedText(result.data);
      },
      {
        highlightScanRegion: true,
        returnDetailedScanResult: true,
      },
    );

    qrScanner.start();

    return () => {
      qrScanner.stop();
    };
  }, [setScannedText]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden shadow-lg bg-white">
        <video ref={videoRef} className="w-full h-full object-cover" />

        <div className="absolute inset-0 border-4 border-dashed border-blue-400 rounded-xl animate-pulse pointer-events-none" />

        <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-center text-xs py-1">
          Point your camera at a QR code
        </div>

        <button
          onClick={onCancel}
          className="absolute top-2 right-2 bg-white/80 text-black-900 hover:bg-white text-sm px-3 py-2 rounded shadow-md"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
