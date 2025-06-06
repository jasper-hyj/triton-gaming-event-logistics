'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';


export default function SearchPage() {
  const router = useRouter();
  const supabase = createClient();


  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-12 max-w-5xl mx-auto">

    </main>
  );
}