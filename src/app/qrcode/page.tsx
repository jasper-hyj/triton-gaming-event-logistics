"use client";
import BackHomeButton from "@/app/components/BackHomeButton";
import QRCodeStyled from "../components/QRCodeGenerator";
import { useState } from "react";
import QRCodeCreator from "./components/QRCodeCreator";

export default function LocationSearchPage() {
  const [url, setUrl] = useState<string>("");

  const [generate, setGenerate] = useState<boolean>(false);
  const [qrcodeUrl, setQrcodeUrl] = useState<string>("");

  const handleGenerate = () => {
    setGenerate(true);
    setQrcodeUrl(url);
  };

  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-12 max-w-5xl mx-auto">
      <BackHomeButton />
      <QRCodeCreator url={url} setUrl={setUrl} loading={false} handleGenerate={handleGenerate} />
      {generate && <QRCodeStyled url={qrcodeUrl} size={300} />}
    </main>
  );
}
