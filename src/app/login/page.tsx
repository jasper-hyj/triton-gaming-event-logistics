import { redirect } from "next/navigation";
import BackHomeButton from "../components/BackHomeButton";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server";
import GoogleAuthButton from "./google/GoogleAuthButton";
export default async function LoginPage() {
  const {
    data: { user },
  } = await (await createSupabaseServerComponentClient()).auth.getUser();
  if (user) {
    redirect("/");
  }
  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 py-12 max-w-xl mx-auto">
      <BackHomeButton />
      <GoogleAuthButton />
    </main>
  );
}
