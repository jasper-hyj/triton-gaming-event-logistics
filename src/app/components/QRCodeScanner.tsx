"use client";

import { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

type QRCodeScannerProps = {
  onScan: (data: string) => void;
};

const QRCodeScanner = ({ onScan }: QRCodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        onScan(result.data);
      },
      {
        highlightScanRegion: true,
        returnDetailedScanResult: true,
      },
    );

    scannerRef.current = scanner;
    scanner.start();

    return () => {
      scanner.stop();
    };
  }, [onScan]);

  return <video ref={videoRef} className="w-full max-w-sm border border-gray-400 rounded shadow" />;
};

export default QRCodeScanner;
