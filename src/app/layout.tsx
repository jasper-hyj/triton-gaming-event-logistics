import '../styles/globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import Image from 'next/image';
import TGLogo from '@/img/TG Color Logo.png';
import { createSupabaseServerComponentClient } from '@/utils/supabase/server';
import Link from 'next/link';
import GoogleAuthOneTap from './auth/google/GoogleAuthOneTap';

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  title: 'Triton Gaming ELO',
  description: 'A gentle way to manage your gaming gear',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  const {
    data: { user },
    error,
  } = await (await createSupabaseServerComponentClient()).auth.getUser();

  return (
    <html lang="en" className="scroll-smooth bg-white text-gray-800">
      <body className={`${nunito.className} min-h-screen flex flex-col antialiased`}>
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 flex-grow flex flex-col">
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
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                Look for anything you need.
              </p>
            </div>
            {!user ? <Link href="/login" className="px-6 py-2 bg-cyan-800 text-white rounded-md hover:bg-cyan-700 transition">Login</Link>
              : <Link href="/account" className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition">Account</Link>}
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="mt-16 text-center text-sm text-gray-400">
            &copy; 2025 Triton Gaming — Event Logistics Team
          </footer>
        </div>
        {!user && <GoogleAuthOneTap />}
      </body>
    </html>
  );
}
