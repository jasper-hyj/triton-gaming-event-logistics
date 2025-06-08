"use client";

import { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

type QRCodeScannerProps = {
  scannedText: string;
  setScannedText: (text: string) => void;
};

export default function QRCodeScanner({ scannedText, setScannedText }: QRCodeScannerProps) {
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
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden shadow-lg ">
        <video ref={videoRef} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-center text-xs py-1">
          Point your camera at a QR code
        </div>
      </div>

      <p className="text-green-700 font-semibold">{scannedText}</p>
    </div>
  );
}
