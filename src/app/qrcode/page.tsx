"use client";
import BackHomeButton from "@/app/components/BackHomeButton";
import QRCodeStyled, { QRCode } from "../components/QRCodeGenerator";
import { useState } from "react";
import QRCodeInfoBar from "./components/QRCodeCreator";

export default function QRCodeGeneratePage() {
  const [qrcode, setQrcode] = useState<QRCode>({
    url: "",
    size: 500,
    bgColor: "#ffffff00",
  });

  const [generate, setGenerate] = useState<boolean>(false);
  const [qrcodeGenerate, setQrcodeGenerate] = useState<QRCode>(qrcode);

  const handleGenerate = () => {
    setQrcodeGenerate(qrcode);
    setGenerate(true);
  };

  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-12 max-w-5xl mx-auto">
      <BackHomeButton />
      <QRCodeInfoBar
        qrcode={qrcode}
        setQrcode={setQrcode}
        loading={false}
        handleGenerate={handleGenerate}
      />
      {generate && <QRCodeStyled qrcode={qrcodeGenerate} />}
    </main>
  );
}
