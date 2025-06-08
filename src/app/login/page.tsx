import { redirect } from "next/navigation";
import BackHomeButton from "../components/BackHomeButton";
import GoogleAuthButton from "./google/GoogleAuthButton";
import { fetchUserServer } from "@/lib/auth/fetchUserServer";

export default async function LoginPage() {
  const user = await fetchUserServer();
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
