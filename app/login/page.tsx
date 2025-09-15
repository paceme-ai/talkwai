"use client";
import { useState } from "react";
import db from "@/lib/db";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [magicCode, setMagicCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleGoogleLogin = () => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
    const redirectURL = isLocalhost
      ? "http://localhost:3000/dash"
      : `${window.location.origin}/dash`;

    console.log("Hostname:", hostname);
    console.log("Is localhost:", isLocalhost);
    console.log("Redirect URL:", redirectURL);

    const url = db.auth.createAuthorizationURL({
      clientName: "google-web",
      redirectURL: redirectURL,
    });

    window.location.href = url;
  };

  const handleMagicCodeSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await db.auth.sendMagicCode({ email });
      setMessage("Magic code sent! Check your email.");
      setShowCodeInput(true);
    } catch (error) {
      console.error("Error sending magic code:", error);
      setMessage("Failed to send magic code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicCodeVerification = async (e) => {
    e.preventDefault();

    if (!magicCode.trim()) {
      setMessage("Please enter the magic code");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await db.auth.signInWithMagicCode({ email, code: magicCode });
      // Redirect to dashboard on successful login
      window.location.href = "/dash";
    } catch (error) {
      console.error("Error verifying magic code:", error);
      setMessage("Invalid magic code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create the authorization URL:
  // This will be created dynamically in the handleGoogleLogin function
  // to avoid SSR issues with window object

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      {/* Welcome message */}
      <div className="mb-8 text-center">
        <p className="text-gray-600">
          If you're brand-new, we'll get you set up on the next page
        </p>
      </div>

      {/* Main heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Go To Your Dashboard
        </h1>
        <p className="mt-2 text-gray-600">Choose your preferred login method</p>
      </div>

      {/* Login options */}
      <div className="space-y-6">
        {/* Magic code option */}
        {!showCodeInput && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <form onSubmit={handleMagicCodeSubmit}>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="Email icon"
                  >
                    <title>Email icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Email me a Magic Code"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Magic Code Verification */}
        {showCodeInput && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-blue-900 mb-3">
              Enter Magic Code
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              We sent a magic code to {email}. Enter it below to sign in.
            </p>
            <form onSubmit={handleMagicCodeVerification}>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter magic code"
                  value={magicCode}
                  onChange={(e) => setMagicCode(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !magicCode.trim()}
                  className="px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Sign In"}
                </button>
              </div>
            </form>
            <button
              type="button"
              onClick={() => {
                setShowCodeInput(false);
                setMagicCode("");
                setMessage("");
              }}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Use a different email
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Google option */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              aria-label="Google logo"
            >
              <title>Google logo</title>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading ? "Connecting..." : "Connect with Google"}
          </button>
        </div>
      </div>

      {/* Message display */}
      {message && (
        <div className="mt-6 text-center">
          <p
            className={`text-sm ${
              message.includes("sent") ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        </div>
      )}
    </main>
  );
}
