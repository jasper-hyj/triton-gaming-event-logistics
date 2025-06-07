import Link from "next/link";

export default function BackHomeButton() {
  return (
    <Link
      href="/"
      className="mb-8 inline-flex items-center text-gray-600 hover:text-blue-600 transition"
      aria-label="Back to home"
    >
      <svg
        className="w-5 h-5 mr-1 stroke-current"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6"></path>
      </svg>
      Home
    </Link>
  );
}
