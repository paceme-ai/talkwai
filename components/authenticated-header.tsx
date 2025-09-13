"use client";

import Image from "next/image";
import Link from "next/link";
import db from "@/lib/db";
import { useRouter } from "next/navigation";

export default function AuthenticatedHeader() {
  const router = useRouter();
  const user = db.useUser();

  const handleSignOut = () => {
    db.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="TalkwAI Logo"
              width={123}
              height={30}
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(8%) sepia(8%) saturate(1171%) hue-rotate(314deg) brightness(95%) contrast(95%)",
              }}
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="#how" className="hover:text-emerald-700">
            How it works
          </Link>
          <Link href="#solution" className="hover:text-emerald-700">
            Casey
          </Link>
          <Link href="/pricing" className="hover:text-emerald-700">
            Pricing
          </Link>
          <Link href="#contact" className="hover:text-emerald-700">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/dash"
            className="text-sm px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Dashboard
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Sign Out</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Sign out icon"
            >
              <title>Sign out icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
