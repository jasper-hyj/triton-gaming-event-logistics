import "../styles/globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import GoogleAuthOneTap from "./login/google/GoogleAuthOneTap";
import { UserProvider } from "./login/UserContext";
import Header from "./components/Header";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Triton Gaming ELO",
  description: "Look for anything you need.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth bg-white text-gray-800">
      <body className={`${nunito.className} min-h-screen flex flex-col antialiased`}>
        <UserProvider>
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 flex-grow flex flex-col">
            <Header />

            <main className="flex-grow">{children}</main>

            <footer className="mt-16 text-center text-sm text-gray-400">
              &copy; 2025 Triton Gaming — Event Logistics Team
            </footer>
          </div>
          <GoogleAuthOneTap />
        </UserProvider>
      </body>
    </html>
  );
}
