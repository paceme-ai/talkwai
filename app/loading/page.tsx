"use client";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import db from "@/lib/db";

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMagicCode, setShowMagicCode] = useState(false);
  const [magicCode, setMagicCode] = useState("");
  const [pendingMember, setPendingMember] = useState(null);

  // Check for pending member data and show magic code input
  useEffect(() => {
    const memberData = localStorage.getItem('pendingMember');
    if (memberData) {
      setPendingMember(JSON.parse(memberData));
      // Show magic code input after a short delay
      setTimeout(() => {
        setShowMagicCode(true);
      }, 2000);
    }
  }, []);

  // Check for error or success status from URL params
  useEffect(() => {
    const error = searchParams.get("error");
    const successStatus = searchParams.get("status");

    if (error) {
      setStatus("error");
      setErrorMessage(decodeURIComponent(error));
    } else if (successStatus === "success") {
      setStatus("success");
    }
  }, [searchParams]);

  // Handle magic code submission
  const handleMagicCodeSubmit = async (e) => {
    e.preventDefault();
    if (!magicCode.trim() || !pendingMember) return;

    try {
      await db.auth.signInWithMagicCode({ 
        email: pendingMember.email, 
        code: magicCode.trim() 
      });
      
      // Clear pending member data
      localStorage.removeItem('pendingMember');
      
      // Set success status and continue with progress
      setStatus("success");
      setShowMagicCode(false);
    } catch (error) {
      console.error('Magic code verification failed:', error);
      setErrorMessage('Invalid verification code. Please try again.');
    }
  };

  useEffect(() => {
    // Only animate progress if status is loading or success, and not showing magic code
    if (status === "error" || showMagicCode) return;

    // Animate progress bar over 20 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Redirect to dashboard after loading completes (only if successful)
          if (status === "success") {
            setTimeout(() => {
              router.push("/dash");
            }, 500);
          }
          return 100;
        }
        return prev + 100 / 200; // 100% over 20 seconds (200 intervals of 100ms)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [router, status, showMagicCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            {status === "error" ? "Oops!" : "Welcome to"}
          </h1>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Diversified Capital Benefits Group
          </h2>
          <p className="text-lg text-slate-600">
            {status === "error"
              ? "We encountered an issue processing your request."
              : status === "success"
                ? "Your information has been saved! Initiating call..."
                : "Loading sample employee census..."}
          </p>
          {status === "error" && errorMessage && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">Error Details:</p>
              <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          )}
        </motion.div>

        {/* Magic Code Input - Show when needed */}
        {showMagicCode && status !== "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Verify Your Email
              </h3>
              <p className="text-slate-600 mb-4">
                We sent a verification code to <strong>{pendingMember?.email}</strong>. 
                Please enter it below to continue.
              </p>
              <form onSubmit={handleMagicCodeSubmit} className="space-y-4">
                <input
                  type="text"
                  value={magicCode}
                  onChange={(e) => setMagicCode(e.target.value)}
                  placeholder="Enter verification code"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-lg font-mono"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  disabled={!magicCode.trim()}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Verify Code
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Loading Bar Container - Hide on error */}
        {status !== "error" && !showMagicCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Progress Bar Background */}
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              {/* Animated Progress Bar */}
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full relative overflow-hidden"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>

            {/* Progress Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-sm font-medium text-slate-500"
            >
              {Math.round(progress)}% Complete
            </motion.div>
          </motion.div>
        )}

        {/* Loading Dots Animation - Hide on error */}
        {status !== "error" && !showMagicCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex justify-center space-x-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-indigo-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <LoadingContent />
    </Suspense>
  );
}
