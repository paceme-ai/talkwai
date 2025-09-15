"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import db from "@/lib/db";

export default function Header() {
  const router = useRouter();
  const { user, isLoading } = db.useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    db.auth.signOut();
    router.push("/");
  };

  // Authenticated header for dashboard and when user is signed in
  const AuthenticatedHeader = () => (
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
        className="text-sm hover:text-emerald-700 flex items-center gap-1 border border-black px-3 py-1 rounded"
      >
        <span>Sign Out</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-label="Sign out icon"
        >
          <title>Sign out</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </div>
  );

  // Unauthenticated header for public pages
  const UnauthenticatedHeader = () => (
    <div className="flex items-center gap-3">
      <Link
        href="/register"
        className="text-sm px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
      >
        Get Started
      </Link>
      <Link
        href="/login"
        className="text-sm hover:text-emerald-700 border border-black px-3 py-1 rounded min-w-[90px] text-center flex items-center justify-center gap-1"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-label="Login icon"
        >
          <title>Login</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
        <span>Login</span>
      </Link>
    </div>
  );

  // Prevent hydration mismatch by not rendering auth-dependent content until mounted
  if (!mounted || isLoading) {
    return (
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b relative">
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
                className="w-24 sm:w-30"
              />
            </Link>
          </div>
          <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b relative">
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
              className="w-24 sm:w-30"
            />
          </Link>
        </div>
        {user ? <AuthenticatedHeader /> : <UnauthenticatedHeader />}
      </div>
    </header>
  );
}
