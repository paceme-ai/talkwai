"use client";
import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import db from "@/lib/db";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_NAME =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_NAME || process.env.GOOGLE_CLIENT_NAME;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [magicCode, setMagicCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [nonce] = useState(crypto.randomUUID());

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
                  placeholder="Email address to send code"
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
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="flex justify-center items-center">
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleLogin
                size="large"
                width="300"
                nonce={nonce}
                onError={() => setMessage("Login failed")}
                onSuccess={({ credential }) => {
                  setIsLoading(true);
                  db.auth
                    .signInWithIdToken({
                      clientName: GOOGLE_CLIENT_NAME,
                      idToken: credential,
                      nonce,
                    })
                    .then(() => {
                      window.location.href = "/dash";
                    })
                    .catch((err) => {
                      setMessage("Uh oh: " + err.body?.message);
                      setIsLoading(false);
                    });
                }}
              />
            </GoogleOAuthProvider>
          </div>
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
