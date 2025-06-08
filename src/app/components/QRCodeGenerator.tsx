"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

// You can import your logo/icon
import logo from "@/img/TG Color Logo.png"; // or use public URL string

type Props = {
  url: string;
};

const QRCodeStyled = ({ url }: Props) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({
        width: 200,
        height: 200,
        type: "canvas",
        data: url,
        image: logo.src,
        margin: 10,

        qrOptions: {
          mode: "Byte",
          errorCorrectionLevel: "H",
        },

        imageOptions: {
          crossOrigin: "anonymous",
          imageSize: 0.4,
          margin: 0,
        },

        dotsOptions: {
          color: "#1e3a8a",
          type: "extra-rounded",
          gradient: {
            type: "radial",
            colorStops: [
              { offset: 0, color: "#8ba7c4" },
              { offset: 1, color: "#002951" },
            ],
          },
        },

        backgroundOptions: {
          color: "#ffffff",
        },

        cornersSquareOptions: {
          type: "extra-rounded",
          color: "#f59e0b",
        },

        cornersDotOptions: {
          type: "dot",
          color: "#facc15",
        },
      });
    }

    if (qrRef.current) {
      qrRef.current.innerHTML = ""; // clear previous canvas
      qrCodeRef.current?.update({ data: url });
      qrCodeRef.current?.append(qrRef.current);
    }
  }, [url]);

  const handleDownload = async () => {
    if (!qrCodeRef.current || !url) return;
    await qrCodeRef.current.download({
      name: `${url}-qr`,
      extension: "png",
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={qrRef} />
      <button
        onClick={handleDownload}
        className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800 transition"
      >
        Download QR Code
      </button>
    </div>
  );
};

export default QRCodeStyled;
